import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw , ContentState ,convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import styles from './assets/styles/TextEditor.module.scss';
import './assets/styles/stylesOverride.css';
import { toolbarConfig } from "./ToolbarConfig";
import htmlToDraft from 'html-to-draftjs';
import { Required } from "../required";

export const TextEditor = (props) => {
  const { 
    id,
    isRequired,
    label,
    placeholder,
    maxCharLimit,
    template,
    setTemplate,
    jestTestData 
  } = props;

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [isEmptyTemplate,setIsEmptyTemplate] = useState(true)
  const [textLimitWarning,setTextLimitWarning] = useState(false)

  useEffect(() => {
    if(template && template.length){
      const blocksFromHtml = htmlToDraft(template);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState));
    }
    if(jestTestData?.setWarning){
      setTextLimitWarning(true)
    }
  }, []);

  useEffect(()=>{ 
    let htmlTemplate = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    htmlTemplate = replaceEmptyPTagWithLineBreak(htmlTemplate);
    htmlTemplate = replaceEmptySpaceWithNbsp(htmlTemplate)
    setTemplate(htmlTemplate)
    const isEmpty = /^\s*$/.test(editorState.getCurrentContent().getPlainText(''));
    if (isEmpty) {
      setIsEmptyTemplate(true)
    }else{
      setIsEmptyTemplate(false)
    }
  },[editorState])

  const handleEditorChange = (editorState) => {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;
    if (currentContentLength == maxCharLimit) {
      setTextLimitWarning(true);
      setEditorState(editorState);
    }else if (currentContentLength < maxCharLimit) {
      setTextLimitWarning(false);
      setEditorState(editorState);
    } else {
      setTextLimitWarning(true)
    }
  };

  const handleBeforeInput = (char, editorState) => {
    const currentContentLength = editorState.getCurrentContent().getPlainText('').length;

    if (currentContentLength >= maxCharLimit) {
      setTextLimitWarning(true);
      return 'handled';
    }
    setTextLimitWarning(false);
    return 'not-handled';
  };

  const renderCharacterLimit = () => {
    return (
      <div className={styles.charCounter}>
      {textLimitWarning ?
        (<span
          data-testid={'char-limit-reached'}
          className={`${textLimitWarning ? styles.warning : ''}`}>
          {`Character limit reached`}
        </span>)
        :
        (<span
          data-testid={'max-char-counter'}>
          {`Maximum ${maxCharLimit} characters`} 
        </span>)
      }
      {isEmptyTemplate ?
        ''
        :
        (<span className={`${textLimitWarning ? styles.warning : ''}`}>
          {` (${editorState.getCurrentContent().getPlainText('').length}/${maxCharLimit})`}
        </span>)
      }
      </div>
    )
  }

  const currentBlockType = () => {
    const selection = editorState.getSelection();
    return editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
  };

  const getPlaceholderText = () => {
    if(currentBlockType() === 'unordered-list-item' || currentBlockType() === 'ordered-list-item'){
      return ''
    }
    return placeholder
  }


  /**
   * Modify existing behaviour of library - <p></p> is used for empty line
   * Replaces empty <p> tag for new line with <br> tag
   */
  const replaceEmptyPTagWithLineBreak = (htmlString) => {
    return htmlString.replace(/<p><\/p>/gi, "<br/>"); 
  }

  /**
   * Modify existing behaviour of library - continuous blank space between words treated 
   * as single blank space
   * Replaces continuous blank spaces with &nbsp;
   */


  const replaceEmptySpaceWithNbsp = (text) => {
    // Match white spaces not within tags or styles and not outside a pair of opening and closing tags
    return text.replace(/ {2,}/g, function(match) {
      return '&nbsp;'.repeat(match.length);
    });
  }

  return (
    <div>

      <div className={styles.outerRow}>
        {label && (
          <div className={styles.labelText}>
            <span>{label}</span>
          </div>
        )}
        {isRequired && (
          <Required id={id} isLegend={true}/>
        )}
      </div>

      <Editor
        editorState={editorState}
        handleBeforeInput={handleBeforeInput}
        toolbar={toolbarConfig}
        placeholder={getPlaceholderText()}
        editorClassName={styles.editorClass}
        onEditorStateChange={handleEditorChange}
      />

      { renderCharacterLimit() }

      {/* Uncomment below code for checking html output */}
      {/*<textarea
        disable
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
    /> */}
    </div>
  );
};

TextEditor.propTypes = {
  isRequired:PropTypes.bool,
  maxCharLimit:PropTypes.number,
  label:PropTypes.string,
  placeholder:PropTypes.string,
};

TextEditor.defaultProps = {
  maxCharLimit:5000,
  isRequired:false,
  label:'',
  placeholder:''
};