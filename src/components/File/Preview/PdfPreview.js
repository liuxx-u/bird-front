import React from 'react';
import PropTypes from 'prop-types';
import styles from './DocPreview.less';

class PdfPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className={styles.preview}>
        <div className={styles.doc}>
          <embed className={styles.embed} src={this.props.url}/>
        </div>
      </div>
    )
  }
}

PdfPreview.propTypes = {
  name:PropTypes.string,
  url: PropTypes.string
};

PdfPreview.defaultProps = {
};


export default PdfPreview
