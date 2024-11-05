import React, { memo, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import { Loader } from '@mckesson/mcp-component-library';

import ImgElement from './ImgElement';
import HtmlElement from './HtmlElement';
import PdfElement from './PdfElement';
import DefaultElement from './DefaultElement';
import DocumentsService from '../../api/documentsService/DocumentsService';
import CommonUtils from '../../common/util/CommonUtils';

import useSnackbar from '../../common/hooks/useSnackbar';

function DocumentRenderer({
  externalId,
  patientDetails,
  entityType,
  // content,
  heightPx = '800px',
  widthPx = '100%',
  maxWidthPx,
  zoomFactor,
  rotateFactor,
  setIsDefaultElement
}) {
  let url = '';
  const [searchParams] = useSearchParams();

  // Document Rotation
  const normalizedRotateFactor = rotateFactor % 360; // Ensure the value stays within 0–360
  const isHorizontalRotation = normalizedRotateFactor === 90 || normalizedRotateFactor === 270;

  const { showSnackbar } = useSnackbar();
  const [type, setType] = useState();

  const { data, refetch, isLoading } = useQuery(
    ['getDocumentDetails', { externalId, patientDetails }],
    () => {
      if (externalId && entityType) {
        return DocumentsService.getDocumentDetails({
          documentId: externalId,
          practiceId: patientDetails.practicePublicId,
          patientId: patientDetails.patientPublicId,
          entityType: entityType
        });
      }
    },
    {
      enabled: !!patientDetails && !!externalId,
      onSuccess: (data) => {
        setType(getDataContentType(data));
        return data;
      },
      onError: (error) => {
        showSnackbar({
          description: error.response.data?.message || 'Server error',
          type: 'error'
        });
        setType('nodata');
        console.error(error);
        return {};
      }
    }
  );
  const getDataContentType = (data) => {
    const documentIdParam = searchParams.get('documentId');
    if (!CommonUtils.isNonEmptyString(data.content)) {
      return 'nodata';
    }
    if (documentIdParam === 'noData') {
      return 'nodata/filter';
    }
    if (data) {
      return data.contentType;
    }
  };

  useEffect(() => {
    refetch();
  }, [searchParams]);

  const convertToPdf = (content) => {
    if (content) {
      const base64Str = atob(content);

      const arr = new Uint8Array(base64Str.length);
      for (let i = 0; i < base64Str.length; i++) {
        arr[i] = base64Str.charCodeAt(i);
      }
      const blob = new Blob([arr], { type: 'application/pdf' });
      url = URL.createObjectURL(blob);
      return url;
    }
  };

  const renderElement = () => {
    switch (type) {
      case 'image/bmp':
      case 'image/gif':
      case 'image/heic':
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/pjpeg':
      case 'image/png':
      case 'image/svg + xml':
      case 'image/tiff':
        setIsDefaultElement(false);
        return (
          <ImgElement
            content={data?.content}
            url={url}
            type={type}
            heightPx={heightPx}
            widthPx={widthPx}
            zoomFactor={zoomFactor / 100}
            rotateFactor={`${rotateFactor}deg`}
          />
        );
      case 'text/plain; charset=utf-8':
      case 'text/html; charset=utf-8':
      case 'application/xml':
      case 'text/html':
      case 'text/xml':
        setIsDefaultElement(false);
        return (
          <HtmlElement
            content={data?.content}
            url={url}
            type={type}
            heightPx={heightPx}
            widthPx={widthPx}
            zoomFactor={zoomFactor / 100}
            rotateFactor={`${rotateFactor}deg`}
            isHorizontalView={isHorizontalRotation}
            maxWidthPx={maxWidthPx - 32}
          />
        );
      case 'text/plain':
        setIsDefaultElement(false);
        return (
          <HtmlElement
            content={data?.content}
            url={url}
            type={`${type}; charset=utf-8`}
            heightPx={heightPx}
            widthPx={widthPx}
            zoomFactor={zoomFactor / 100}
            rotateFactor={`${rotateFactor}deg`}
          />
        );
      case 'application/pdf':
        setIsDefaultElement(false);
        return (
          <PdfElement
            url={convertToPdf(data?.content)}
            heightPx={heightPx}
            widthPx={widthPx}
            zoomFactor={zoomFactor}
            rotateFactor={rotateFactor}
            isHorizontalView={isHorizontalRotation}
          />
        );
      case 'nodata/filter':
      case 'nodata':
        setIsDefaultElement(true);
        return <DefaultElement type={type} />;
      default:
        setIsDefaultElement(true);
        return <DefaultElement />;
    }
  };

  if (!externalId) {
    return <></>;
  }

  return <>{isLoading ? <Loader loaderText="" /> : type && renderElement()}</>;
}

export default memo(DocumentRenderer);
