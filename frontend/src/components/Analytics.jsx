import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const mockData = [
    { date: '15 Бер', users: 12 },
    { date: '16 Бер', users: 19 },
    { date: '17 Бер', users: 5 },
    { date: '18 Бер', users: 22 },
    { date: '19 Бер', users: 14 }
];

export default function Analytics() {
    return (
        <div style={{ maxWidth: '600px' }}>
            <h2>Аналітика реєстрацій за днями</h2>
            <p>Відображення активності учасників за допомогою Recharts.</p>
            
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" fill="#4CAF50" name="Кількість реєстрацій" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}