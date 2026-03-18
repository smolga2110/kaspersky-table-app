import { Link } from "react-router-dom"
import { FaAccusoft } from "react-icons/fa6";

function Header(){
    return(
        <header className="border-b sticky top-0 bg-white z-10">
            <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
                <div className="flex items-center gap-2">
                    <FaAccusoft className="text-2xl" />
                    <Link to="/" className="font-medium">UserGroups</Link>
                </div>
                <nav>
                    <ul className="flex gap-5">
                        <li>
                            <Link to="/users" className="text-gray-600 hover:text-black">
                                Пользователи
                            </Link>
                        </li>
                        <li>
                            <Link to="/groups" className="text-gray-600 hover:text-black">
                                Группы
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header