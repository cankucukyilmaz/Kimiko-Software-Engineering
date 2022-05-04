import { BASE_CONF } from '../kimiko-common/vars';

function Header() {

    const clickHandler = () => {
        window.open(BASE_CONF.full(), "_blank")
    }

    return (
        <div className="Header" onClick={clickHandler}>
            <div className="Header-Heading">{"kimiko"}</div>
        </div>
    )
}
export default Header;