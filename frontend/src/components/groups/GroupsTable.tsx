// GroupsTable.tsx
import React, { useEffect, useState, useMemo, useCallback } from "react"
import axios from "axios"
import { ApiResponse } from "../../types"

interface GroupStat {
    name: string
    count: number
}

function GroupsTable() {
    const [groups, setGroups] = useState<GroupStat[]>([])
    const [searchGroups, setSearchGroups] = useState<GroupStat[]>([])

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get<ApiResponse>("http://localhost:3000/api/users")
                const users = response.data.data.users || []
                
                // Подсчитываем количество пользователей в каждой группе
                const groupCounts = users.reduce<Record<string, number>>((acc, user) => {
                    const groupName = user.group || "Unmanaged"
                    acc[groupName] = (acc[groupName] || 0) + 1
                    return acc
                }, {})
                
                // Преобразуем в массив для отображения
                const groupList = Object.entries(groupCounts).map(([name, count]) => ({
                    name,
                    count
                }))
                
                setGroups(groupList)
            } catch (error) {
                console.error(error)
            }
        }
        fetchUsers()
    }, [])

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase()
        if (term) {
            setSearchGroups(groups.filter(group => 
                group.name.toLowerCase().includes(term)
            ))
        } else {
            setSearchGroups([])
        }
    }, [groups])

    const displayedGroups = useMemo(() => 
        searchGroups.length > 0 ? searchGroups : groups,
        [searchGroups, groups]
    )

    return (
        <div className="p-4">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Поиск по названию группы..."
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border text-center">Группа</th>
                            <th className="p-2 border text-center">Количество участников</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedGroups.map(group => (
                            <tr key={group.name} className="hover:bg-gray-50">
                                <td className="p-2 border font-medium">{group.name}</td>
                                <td className="p-2 border text-center">{group.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default GroupsTable