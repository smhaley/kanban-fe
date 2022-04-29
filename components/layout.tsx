import react, {FunctionComponent} from "react"
import Header from "./header/header"

export default function Layout({children}: {children: JSX.Element}) {

return <><Header/>{children}</>

}