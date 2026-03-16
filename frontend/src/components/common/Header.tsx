import { Link } from "react-router-dom"

function Header(){
    return(
        <header>
            <span><Link to="/">UserGroups</Link></span>
            <nav>
                <ul>
                    <li><Link to="/users">Пользователи</Link></li>
                    <li><Link to="/groups">Группы</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header