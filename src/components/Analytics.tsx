import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import salesData from '../data/sales.json';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend
);

interface Sale {
    id: number;
    date: string;
    manager: string;
    product: string;
    customerId: number;
    isLead: boolean;
    amount: number;
}

const getSalesData = (data: any): Sale[] => {
    if (Array.isArray(data)) {
        return data;
    } else if (data && Array.isArray(data.sales)) {
        return data.sales;
    }
    return [];
};

const Analytics: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const data: Sale[] = getSalesData(salesData);

    useEffect(() => {
        setIsLoading(false);
        console.log('Raw salesData:', salesData);
        console.log('Processed data:', data);
    }, []);

    if (isLoading) {
        return <div>Завантаження...</div>;
    }

    if (data.length === 0) {
        return <div>Помилка: Дані про продажі відсутні.</div>;
    }

    const salesByDay = data.reduce((acc: { [date: string]: number }, sale) => {
        acc[sale.date] = (acc[sale.date] || 0) + sale.amount;
        return acc;
    }, {});
    const sortedDates = Object.keys(salesByDay).sort();

    const leadsByDay = data.reduce((acc: { [date: string]: number }, sale) => {
        if (sale.isLead) {
            acc[sale.date] = (acc[sale.date] || 0) + 1;
        }
        return acc;
    }, {});
    const leadsData = sortedDates.map((date) => leadsByDay[date] || 0);

    const ordersByCustomer = data.reduce((acc: { [id: number]: number }, sale) => {
        acc[sale.customerId] = (acc[sale.customerId] || 0) + 1;
        return acc;
    }, {});
    const repeatCounts = Object.values(ordersByCustomer).reduce((acc: { [count: number]: number }, count) => {
        acc[count] = (acc[count] || 0) + 1;
        return acc;
    }, {});
    const repeatLabels = Object.keys(repeatCounts).map((count) => `${count} покупки`);
    const repeatData = Object.values(repeatCounts);

    const revenueByMonth = data.reduce((acc: { [month: string]: number }, sale) => {
        const month = sale.date.slice(0, 7);
        acc[month] = (acc[month] || 0) + sale.amount;
        return acc;
    }, {});
    const sortedMonths = Object.keys(revenueByMonth).sort();

    const salesByManager = data.reduce((acc: { [manager: string]: number }, sale) => {
        acc[sale.manager] = (acc[sale.manager] || 0) + sale.amount;
        return acc;
    }, {});
    const managerLabels = Object.keys(salesByManager);

    const managerStats = managerLabels.map((manager) => {
        const managerSales = data.filter((s) => s.manager === manager);
        const orders = managerSales.length;
        const revenue = managerSales.reduce((sum, s) => sum + s.amount, 0);
        const avgCheck = orders > 0 ? (revenue / orders).toFixed(2) : 0;
        return { manager, orders, revenue, avgCheck };
    });

    const productStats = data.reduce((acc: { [product: string]: { units: number; revenue: number } }, sale) => {
        if (!acc[sale.product]) acc[sale.product] = { units: 0, revenue: 0 };
        acc[sale.product].units += 1;
        acc[sale.product].revenue += sale.amount;
        return acc;
    }, {});
    const lowTurnover = Object.entries(productStats)
        .map(([product, { units, revenue }]) => ({ product, units, revenue }))
        .sort((a, b) => a.revenue - b.revenue);

    console.log('salesByDay:', salesByDay);
    console.log('leadsByDay:', leadsByDay);
    console.log('repeatCounts:', repeatCounts);
    console.log('revenueByMonth:', revenueByMonth);
    console.log('salesByManager:', salesByManager);
    console.log('managerStats:', managerStats);
    console.log('lowTurnover:', lowTurnover);

    return (
        <div className="analytics">
            <h2>Аналітика продажів</h2>
            <div className="charts">
                <div className="chart-container">
                    <h3>Продажі по днях</h3>
                    <Line
                        data={{
                            labels: sortedDates.length ? sortedDates : ['Немає даних'],
                            datasets: [
                                {
                                    label: 'Продажі',
                                    data: sortedDates.length ? sortedDates.map((date) => salesByDay[date] || 0) : [0],
                                    borderColor: '#007bff',
                                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                                    fill: true,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, // Дозволяємо змінювати пропорції
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                            plugins: {
                                legend: { display: true },
                                tooltip: { enabled: true },
                            },
                        }}
                    />
                </div>
                <div className="chart-container">
                    <h3>Ліди по днях</h3>
                    <Bar
                        data={{
                            labels: sortedDates.length ? sortedDates : ['Немає даних'],
                            datasets: [
                                {
                                    label: 'Ліди',
                                    data: sortedDates.length ? leadsData : [0],
                                    backgroundColor: '#28a745',
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
                <div className="chart-container">
                    <h3>Повторні покупки</h3>
                    <Pie
                        data={{
                            labels: repeatLabels.length ? repeatLabels : ['Немає даних'],
                            datasets: [
                                {
                                    data: repeatLabels.length ? repeatData : [0],
                                    backgroundColor: ['#ff4d4f', '#ff8c00', '#ffeb3b', '#28a745', '#007bff'],
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
                <div className="chart-container">
                    <h3>Оборот за місяцями</h3>
                    <Line
                        data={{
                            labels: sortedMonths.length ? sortedMonths : ['Немає даних'],
                            datasets: [
                                {
                                    label: 'Оборот',
                                    data: sortedMonths.length ? sortedMonths.map((month) => revenueByMonth[month] || 0) : [0],
                                    borderColor: '#6f42c1',
                                    backgroundColor: 'rgba(111, 66, 193, 0.2)',
                                    fill: true,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                </div>
                <div className="chart-container">
                    <h3>Продажі по менеджерах</h3>
                    <Radar
                        data={{
                            labels: managerLabels.length ? managerLabels : ['Немає даних'],
                            datasets: [
                                {
                                    label: 'Продажі',
                                    data: managerLabels.length ? managerLabels.map((m) => salesByManager[m] || 0) : [0],
                                    backgroundColor: 'rgba(255,99,132,0.2)',
                                    borderColor: '#ff4d4f',
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}
                    />
                </div>
            </div>

            <div className="tables">
                <h3>Дохід по менеджерах</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Менеджер</th>
                        <th>Замовлення</th>
                        <th>Дохід</th>
                        <th>Середній чек</th>
                    </tr>
                    </thead>
                    <tbody>
                    {managerStats.map((stat) => (
                        <tr key={stat.manager}>
                            <td>{stat.manager}</td>
                            <td>{stat.orders}</td>
                            <td>{stat.revenue}</td>
                            <td>{stat.avgCheck}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <h3>Товари з низьким обігом</h3>
                <table>
                    <thead>
                    <tr>
                        <th>Товар</th>
                        <th>Одиниці</th>
                        <th>Дохід</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lowTurnover.map((stat) => (
                        <tr key={stat.product}>
                            <td>{stat.product}</td>
                            <td>{stat.units}</td>
                            <td>{stat.revenue}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Analytics;