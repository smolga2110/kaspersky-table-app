import React, { useEffect, useState } from "react"
import axios from "axios"
import { ApiResponse, User } from "../../types"
import { FaArrowUpZA, FaArrowDownAZ  } from "react-icons/fa6";
import AddUserForm from "./AddUserForm";


function UserTable(){

    const [users, setUsers] = useState<User[]>([])
    const [searchUsers, setSearchUsers] = useState<User[]>([])
    const [userIDs, setUserIDs] = useState<string[]>([])
    const [direction, setDirection] = useState<"up" | "down">("up")
    const [showAddForm, setShowAddForm] = useState(false)

    const allSelected = userIDs.length > 0 && userIDs.length === users.length

    useEffect(() => {
        async function fetchUsers(){
            try {
                const response = await axios.get<ApiResponse>("http://localhost:3000/api/users")

                setUsers(response.data.data.users)

            } catch (error) {
                console.error(error)
            }
        }

        fetchUsers()

    }, [])

    const handleDeleteUsers = async ( ids: string[]) => {
        try {

            const response = await axios.post<ApiResponse>("http://localhost:3000/api/users/delete", { ids: userIDs})

            setUsers(response.data.data.users)
            setUserIDs([])

        } catch (error) {
            console.error(error)
        }
    }

    const handleSort = (field: keyof User) => {
        direction === "up" ? setDirection("down") : setDirection("up")

        setUsers([...users].sort((a, b) => {
            if (a[field] < b[field]) return direction === "down" ? 1 : -1
            if (a[field] > b[field]) return direction === "down" ? -1 : 1
            return 0
        }))
    }

    const handleUserAdded = (newUser: User) => {
        setUsers(prev => [...prev, newUser])
    }

    return(
        <>
            <input type="text" onChange={(e) => {
                if (e.target.value){
                    setSearchUsers(users.filter(user => 
                        user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        user.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        user.phone.toLowerCase().includes(e.target.value.toLowerCase())
                    ))
                }
                else{
                    setSearchUsers([])
                }
            }}/>
            <button onClick={() => setShowAddForm(true)} className="flex">
                    Добавить пользователя
            </button>
            {userIDs.length > 0 ? (
                <button onClick={() => handleDeleteUsers(userIDs)}>
                    Удалить
                </button>) 
                : 
                <button disabled>
                    Выберите пользователей
                </button>
            }

            {showAddForm && (
                <AddUserForm 
                    onUserAdded={handleUserAdded}
                    onClose={() => setShowAddForm(false)}
                />
            )}


            <table>
                <thead>
                    <tr>
                        <th scope="col">
                            <input type="checkbox" checked={allSelected} onChange={(e) => {
                                if (e.target.checked) {
                                    setUserIDs(users.map((user) => user.id))
                                }
                                else{
                                    setUserIDs([])
                                }
                            }}/>
                        </th>
                        <th scope="col" id="name" onClick={() => handleSort('name')}>Имя{direction === "down" ? <FaArrowDownAZ/> : <FaArrowUpZA/>}</th>
                        <th scope="col" id="login">Учетная запись</th>
                        <th scope="col" id="email">Почта</th>
                        <th scope="col" id="group" onClick={() => handleSort('group')}>Группа</th>
                        <th scope="col" id="number">Телефон</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        (searchUsers.length > 0 ? searchUsers : users).map((user: User) => {
                            return(
                                <tr>
                                    <td>
                                        <input type="checkbox" value={user.id} onChange={(e) => {
                                                if (e.target.checked){
                                                    setUserIDs([...userIDs, e.target.value])
                                                }
                                                else{
                                                    setUserIDs(userIDs.filter((id) => id !== e.target.value))
                                                }
                                            }}
                                            checked={userIDs.includes(user.id)}
                                        />
                                    </td>
                                    <th scope="row">{user.name}</th>
                                    <td>{user.login}</td>
                                    <td>{user.email}</td>
                                    <td>{user.group}</td>
                                    <td>{user.phone}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}

export default UserTable