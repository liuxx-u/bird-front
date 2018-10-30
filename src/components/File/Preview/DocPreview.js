import React from 'react';
import PropTypes from 'prop-types';
import styles from './DocPreview.less';

class DocPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    return (
      <div className={styles.preview}>
        <div className={styles.doc}>
          <iframe src={'https://view.officeapps.live.com/op/view.aspx?src=' + this.props.url} width='100%' height='100%'></iframe>
        </div>
      </div>
    )
  }
}

DocPreview.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string
};

DocPreview.defaultProps = {
};


export default DocPreview
