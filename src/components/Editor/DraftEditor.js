import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styles from './DraftEditor.less';

class DraftEditor extends React.Component{
  constructor(props) {
    super(props);

    let editorState = EditorState.createEmpty();
    if (this.props.initValue) {
      const contentBlock = htmlToDraft(this.props.initValue);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        editorState = EditorState.createWithContent(contentState);
      }
    }

    this.state = {
      editorState: editorState
    }
  }

  onChange(editorState) {
    this.setState({
      editorState: editorState
    })

    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.props.onChange && this.props.onChange(html);
  }

  render() {
    return <Editor toolbarClassName={styles.toolbar}
                   wrapperClassName={styles.wrapper}
                   editorClassName={styles.editor}
                   editorState={this.state.editorState}
                   onEditorStateChange={editorState => this.onChange(editorState)}/>
  }
}

DraftEditor.propTypes={
  initValue:PropTypes.string,
  onChange:PropTypes.func
}

export default DraftEditor
