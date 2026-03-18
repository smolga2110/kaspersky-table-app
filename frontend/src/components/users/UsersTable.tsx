import React, { useEffect, useState, useMemo, useCallback } from "react"
import axios from "axios"
import { ApiResponse, User } from "../../types"
import { FaArrowUpZA, FaArrowDownAZ } from "react-icons/fa6";
import AddUserForm from "./AddUserForm";

function UserTable(){
    const [users, setUsers] = useState<User[]>([])
    const [searchUsers, setSearchUsers] = useState<User[]>([])
    const [userIDs, setUserIDs] = useState<string[]>([])
    const [direction, setDirection] = useState<"up" | "down">("up")
    const [showAddForm, setShowAddForm] = useState(false)

    const allSelected = useMemo(() => 
        userIDs.length > 0 && userIDs.length === users.length, 
        [userIDs.length, users.length]
    )

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

    const handleDeleteUsers = useCallback(async (ids: string[]) => {
        try {
            const response = await axios.post<ApiResponse>("http://localhost:3000/api/users/delete", { ids: userIDs})
            setUsers(response.data.data.users)
            setUserIDs([])
        } catch (error) {
            console.error(error)
        }
    }, [userIDs])

    const handleSort = useCallback((field: keyof User) => {
        direction === "up" ? setDirection("down") : setDirection("up")
        setUsers([...users].sort((a, b) => {
            if (a[field] < b[field]) return direction === "down" ? 1 : -1
            if (a[field] > b[field]) return direction === "down" ? -1 : 1
            return 0
        }))
    }, [direction, users])

    const handleUserAdded = useCallback((newUser: User) => {
        setUsers(prev => [...prev, newUser])
    }, [])

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    }, [users])

    const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setUserIDs(users.map((user) => user.id))
        }
        else{
            setUserIDs([])
        }
    }, [users])

    const handleSelectUser = useCallback((e: React.ChangeEvent<HTMLInputElement>, userId: string) => {
        if (e.target.checked){
            setUserIDs([...userIDs, e.target.value])
        }
        else{
            setUserIDs(userIDs.filter((id) => id !== e.target.value))
        }
    }, [userIDs])

    const displayedUsers = useMemo(() => 
        searchUsers.length > 0 ? searchUsers : users,
        [searchUsers, users]
    )

    return(
        <div className="p-4">
            <div className="flex gap-4 mb-4">
                <input 
                    type="text" 
                    placeholder="Поиск..."
                    onChange={handleSearchChange}
                    className="px-3 py-2 border rounded flex-1"
                />
                <button 
                    onClick={() => setShowAddForm(true)} 
                    className="px-4 py-2 text-white rounded hover:bg-opacity-90"
                    style={{ backgroundColor: '#009982' }}
                >
                    Добавить
                </button>
                {userIDs.length > 0 ? (
                    <button onClick={() => handleDeleteUsers(userIDs)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                        Удалить
                    </button>
                ) : 
                <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed">
                    Удалить
                </button>
                }
            </div>

            {showAddForm && (
                <AddUserForm 
                    onUserAdded={handleUserAdded}
                    onClose={() => setShowAddForm(false)}
                />
            )}

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th scope="col" className="p-2 border text-center">
                                <input type="checkbox" checked={allSelected} onChange={handleSelectAll}/>
                            </th>
                            <th scope="col" onClick={() => handleSort('name')} className="p-2 border cursor-pointer hover:bg-gray-200 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    Имя
                                    {direction === "down" ? <FaArrowDownAZ/> : <FaArrowUpZA/>}
                                </div>
                            </th>
                            <th scope="col" className="p-2 border text-center">Учетная запись</th>
                            <th scope="col" className="p-2 border text-center">Почта</th>
                            <th scope="col" onClick={() => handleSort('group')} className="p-2 border cursor-pointer hover:bg-gray-200 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    Группа
                                    {direction === "down" ? <FaArrowDownAZ/> : <FaArrowUpZA/>}
                                </div>
                            </th>
                            <th scope="col" className="p-2 border text-center">Телефон</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedUsers.map((user: User) => {
                            return(
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-2 border text-center">
                                        <input 
                                            type="checkbox" 
                                            value={user.id} 
                                            onChange={(e) => handleSelectUser(e, user.id)}
                                            checked={userIDs.includes(user.id)}
                                        />
                                    </td>
                                    <th scope="row" className="p-2 border font-medium text-left">{user.name}</th>
                                    <td className="p-2 border text-left">{user.login}</td>
                                    <td className="p-2 border text-left">{user.email}</td>
                                    <td className="p-2 border text-left">{user.group}</td>
                                    <td className="p-2 border text-left">{user.phone}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserTable