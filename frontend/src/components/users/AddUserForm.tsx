// AddUserForm.tsx
import React, { useState } from "react"
import axios from "axios"
import { ApiResponse, AddUserFormProps } from "../../types"

function AddUserForm({ onUserAdded, onClose }: AddUserFormProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        group: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const validateForm = () => {
        if (!formData.name.trim()) {
            alert("Введите имя")
            return false
        }
        if (!formData.email.includes("@")) {
            alert("Введите корректный email")
            return false
        }
        if (formData.phone.length < 5) {
            alert("Введите корректный телефон")
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!validateForm()) return

        try {
            const response = await axios.post<ApiResponse>(
                "http://localhost:3000/api/users",
                formData
            )

            const newUser = response.data.data.users.slice(-1)[0]
            onUserAdded(newUser)
            onClose()
        } catch (err) {
            alert("Ошибка при добавлении пользователя")
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Добавить пользователя</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Имя *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Телефон *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Группа</label>
                        <input
                            type="text"
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            placeholder="Unmanaged"
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <button 
                            type="submit" 
                            className="px-4 py-2 text-white rounded hover:bg-opacity-90"
                            style={{ backgroundColor: '#009982' }}
                        >
                            Добавить
                        </button>
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50">
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUserForm