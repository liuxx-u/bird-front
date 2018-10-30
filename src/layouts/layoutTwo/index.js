import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import withRouter from 'umi/withRouter'
import LayoutTwo from './layoutTwo'

export default withRouter((props) => {
  return (
    <LocaleProvider locale={zhCN}>
      <LayoutTwo>
        { props.children }
      </LayoutTwo>
    </LocaleProvider>
  )
})
