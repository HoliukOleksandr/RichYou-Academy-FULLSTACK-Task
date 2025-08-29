import React, { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: { name: string };
}

const People: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    if (loading) return <p>Завантаження...</p>;

    return (
        <div className="people">
            <h2>Люди</h2>
            <div className="cards">
                {users.map((user) => (
                    <div key={user.id} className="card">
                        <h3>{user.name}</h3>
                        <p>Email: {user.email}</p>
                        <p>Телефон: {user.phone}</p>
                        <p>Компанія: {user.company.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default People;