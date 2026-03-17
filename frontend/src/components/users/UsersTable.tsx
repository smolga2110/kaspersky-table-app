import { useEffect, useState } from "react"
import axios from "axios"
import { ApiResponse, User } from "../../types"

function UserTable(){

    const [users, setUsers] = useState<User[]>([])
    const [userIDs, setUserIDs] = useState<string[]>([])

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

    return(
        <>
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
                        <th scope="col">Имя</th>
                        <th scope="col">Учетная запись</th>
                        <th scope="col">Почта</th>
                        <th scope="col">Группа</th>
                        <th scope="col">Телефон</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user: User) => {
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