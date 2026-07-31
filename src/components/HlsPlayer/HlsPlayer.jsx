import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { useQuery } from "react-query";
import HttpResourceService, { httpVerb } from "@src/api/HttpResourceService";
import ApiRoutes from "@src/api/ApiRoutes";
import { ORDERMANAGEMENT_SERVICE_BASE_URL } from "@src/config/AppConfig";
import { Loader } from "@mckesson/mcp-component-library";
import Alert from "@src/components/cgat-alert/Alert";
import style from "./HlsPlayer.module.scss";

const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const HlsPlayer = ({ videoId, src: propSrc, poster: propPoster }) => {
  const videoRef = useRef(null);
  const [posterUrl, setPosterUrl] = useState("");

  const { data: videoData, isLoading, isError, error } = useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const res = await HttpResourceService.callRest(ApiRoutes.GET_VIDEO(videoId), httpVerb.GET);
      return res.data;
    },
    enabled: Boolean(videoId),
    refetchOnWindowFocus: false,
  });

  const apiBase = ORDERMANAGEMENT_SERVICE_BASE_URL.endsWith("/")
    ? ORDERMANAGEMENT_SERVICE_BASE_URL.slice(0, -1)
    : ORDERMANAGEMENT_SERVICE_BASE_URL;
  const prefix = apiBase + "/api";

  const videoSrc = prefix + (videoData ? videoData.streamUrl : propSrc || "");

  const { data: thumbnailBlob } = useQuery({
    queryKey: ["video-thumbnail", videoId, videoData?.thumbnailUrl],
    queryFn: async () => {
      if (!videoData?.thumbnailUrl) return null;
      const url = prefix + videoData.thumbnailUrl;
      const res = await HttpResourceService.callRest(
        url,
        httpVerb.GET,
        null,
        null,
        false,
        false,
        false,
        "blob"
      );
      return res.data;
    },
    enabled: Boolean(videoId) && Boolean(videoData?.thumbnailUrl),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!thumbnailBlob) {
      setPosterUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(thumbnailBlob);
    setPosterUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [thumbnailBlob]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    let hls;

    if (Hls.isSupported()) {
      class CustomLoader extends Hls.DefaultConfig.loader {
        constructor(config) {
          super(config);
          const load = this.load.bind(this);
          this.load = function (context, config, callbacks) {
            if (context.url && !context.url.includes('/order-management-service/api')) {
              const filename = context.url.substring(context.url.lastIndexOf('/') + 1);
              const apiBase = ORDERMANAGEMENT_SERVICE_BASE_URL.endsWith("/")
                ? ORDERMANAGEMENT_SERVICE_BASE_URL.slice(0, -1)
                : ORDERMANAGEMENT_SERVICE_BASE_URL;
              context.url = `${apiBase}/api/videos/${videoId}/${filename}`;
            }
            load(context, config, callbacks);
          };
        }
      }

      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        pLoader: CustomLoader,
        fLoader: CustomLoader,
        xhrSetup: function (xhr, url) {
          const token = sessionStorage.getItem('APP_AUTH_TOKEN');
          const sessionId = sessionStorage.getItem('sid');
          if (token) {
            xhr.setRequestHeader('Authorization', token);
          }
          if (sessionId) {
            xhr.setRequestHeader('Session-Id', sessionId);
          }
        }
      });

      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoSrc, videoId]);

  if (isLoading) {
    return (
      <div className={style.videoSectionWrapper} style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
        <Loader variant="circular" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={style.videoSectionWrapper}>
        <Alert
          type="error"
          showTitle={true}
          title="System is facing issues in getting the information. Kindly Contact your System admin."
          showCloseIcon={false}
          description={error && error?.message}
        />
      </div>
    );
  }

  return (
    <div className={style.videoSectionWrapper}>
      {videoSrc && (
        <video
          ref={videoRef}
          controls
          playsInline
          poster={posterUrl || propPoster}
          style={{ width: "100%", height: "100%" }}
        />
      )}
      {videoData && (
        <div className={style.videoInfo}>
          <div className={style.videoMetaRow}>
            {videoData.category && (
              <span className={style.videoBadge}>{videoData.category}</span>
            )}
            {videoData.durationSeconds !== undefined && (
              <span className={style.videoDuration}>
                {formatDuration(videoData.durationSeconds)}
              </span>
            )}
          </div>
          {videoData.description && (
            <p className={style.videoDescription}>{videoData.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HlsPlayer;
