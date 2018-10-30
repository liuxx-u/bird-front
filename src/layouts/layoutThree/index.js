import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import withRouter from 'umi/withRouter'
import LayoutThree from './layoutThree'

export default withRouter((props) => {
  return (
    <LocaleProvider locale={zhCN}>
      <LayoutThree>
        { props.children }
      </LayoutThree>
    </LocaleProvider>
  )
})
