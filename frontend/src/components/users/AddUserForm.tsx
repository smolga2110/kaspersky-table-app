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
        <div>
            <div>
                <h2>Добавить пользователя</h2>
                
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Имя *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Телефон *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label>Группа</label>
                        <input
                            type="text"
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            placeholder="Unmanaged"
                        />
                    </div>

                    <div className="buttons">
                        <button type="submit">
                            Добавить
                        </button>
                        <button type="button" onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUserForm