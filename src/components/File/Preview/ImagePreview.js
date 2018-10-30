import React from 'react';
import styles from './ImagePreview.less';
import { Icon } from 'antd'
import PropTypes from 'prop-types';
import { util } from 'utils';

const maxWidth = 500;

class ImagePreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMagnifier: false,
      scale: 1,
      rotate: 0,

      left: 0,
      top: 0,
      leftRatio: 0,
      topRatio: 0,

      imgWidth: 0,
      imgHeight: 0,

      id: util.string.generateRandom(8)
    }
  }

  mouseEnter() {
    this.setState({ showMagnifier: true })
  }
  mouseLeave() {
    this.setState({ showMagnifier: false })
  }

  mouseMove(ev) {
    let oShadow = document.getElementById(`preview_shadow_${this.state.id}`);

    //鼠标相对于视口的位置
    let x = ev.clientX;
    let y = ev.clientY;

    //box相对于视口的位置
    let element = document.getElementById(`preview_box_${this.state.id}`);
    let boxTop = element.getBoundingClientRect().top;
    let boxLeft = element.getBoundingClientRect().left;

    //move相对位置
    let left = x - boxLeft - oShadow.offsetWidth / 2;
    let top = y - boxTop - oShadow.offsetHeight / 2;

    let maxLeft = element.offsetWidth - oShadow.offsetWidth;
    let maxTop = element.offsetHeight - oShadow.offsetHeight;

    if (left <= 0) {
      left = 0;
    } else if (left > maxLeft) {
      left = maxLeft;
    }
    if (top <= 0) {
      top = 0;
    } else if (top > maxTop) {
      top = maxTop;

    }

    this.setState({
      left: left,
      top: top,
      leftRatio: left / maxLeft,
      topRatio: top / maxTop
    });
  }

  onScaleChange(scale) {
    if (scale < 0) return;
    this.setState({ scale: scale });
  }

  onRotateChange(rotate) {
    this.setState({ rotate: rotate });
  }

  componentDidMount() {
    this.initImageSize();
  }


  initImageSize() {
    let image = document.getElementById(`preview_img_${this.state.id}`);
    if (image == null) {
      setTimeout(() => this.initImageSize(), 500);
      return;
    };

    if (image.naturalWidth > 0) {
      this.setState({
        imgWidth: image.naturalWidth,
        imgHeight: image.naturalHeight
      })
    } else {
      var img = new Image()
      img.src = image.src;
      img.onload = () => {
        this.setState({
          imgWidth: img.width,
          imgHeight: img.height
        });
      }
    }
  }

  render() {
    if (!this.props.url) return <span />;

    let imgStyle = {}, shadowStyle = {}, bigBoxStyle = {};
    let bigImgStyle = {
      width: this.state.imgWidth,
      height: this.state.imgHeight
    };
    if (this.state.imgWidth > 0) {
      let boxImgWidth = this.state.imgWidth > maxWidth ? maxWidth : this.state.imgWidth;

      imgStyle.width = boxImgWidth;
      imgStyle.height = this.state.imgHeight * boxImgWidth / this.state.imgWidth;
    }
    if (this.state.scale > 0) {
      imgStyle.transform = 'scale(' + this.state.scale + ',' + this.state.scale + ')';
    }
    if (this.state.showMagnifier) {
      shadowStyle = {
        display: 'block',
        top: this.state.top,
        left: this.state.left
      };

      bigBoxStyle = {
        display: 'block'
      };

      let bigBoxEle = document.getElementById(`preview_bigbox_${this.state.id}`);
      let bigImgEle = document.getElementById(`preview_bigimg_${this.state.id}`);
      bigImgStyle.top = (bigImgEle.offsetHeight - bigBoxEle.offsetHeight) * this.state.topRatio * (-1);
      bigImgStyle.left = (bigImgEle.offsetWidth - bigBoxEle.offsetWidth) * this.state.leftRatio * (-1);
    } else {
      shadowStyle = { display: 'none' };
      bigBoxStyle = { display: 'none' };
    }
    if (this.state.rotate > 0) {
      bigImgStyle.transform = 'rotate(' + this.state.rotate + 'deg)';
      if (imgStyle.transform) {
        imgStyle.transform += ' rotate(' + this.state.rotate + 'deg)';
      } else {
        imgStyle.transform = 'rotate(' + this.state.rotate + 'deg)';
      }
    }

    return (
      <div className={styles.preview}>
        <div id={`preview_box_${this.state.id}`} className={styles.box} onMouseEnter={() => this.mouseEnter()} onMouseLeave={() => this.mouseLeave()} onMouseMove={e => this.mouseMove(e)}>
          <img id={`preview_img_${this.state.id}`} src={this.props.url} style={imgStyle} />
          <div id={`preview_shadow_${this.state.id}`} className={styles.shadow} style={shadowStyle}></div>
        </div>
        <span className={styles.rotate} >
          <Icon type="plus-circle-o" style={{ fontWeight: '600', fontSize: '16px' }} onClick={() => this.onScaleChange(this.state.scale + 0.1)} />
          <Icon type="minus-circle-o" className={styles.minus} style={{ fontWeight: '600', fontSize: '16px' }} onClick={() => this.onScaleChange(this.state.scale - 0.1)} />
          <Icon type="reload" style={{ fontWeight: '600', fontSize: '16px' }} onClick={() => this.onRotateChange(this.state.rotate + 90)} />
        </span>
        {/*大盒子*/}
        <div id={`preview_bigbox_${this.state.id}`} className={styles.bigbox} style={bigBoxStyle}>
          <img id={`preview_bigimg_${this.state.id}`} src={this.props.url} style={bigImgStyle} />
        </div>
      </div>
    )
  }
}
ImagePreview.propTypes = {
  url: PropTypes.string,
  name: PropTypes.string
};

ImagePreview.defaultProps = {
};

export default ImagePreview
