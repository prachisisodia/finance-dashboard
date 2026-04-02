import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved
      ? JSON.parse(saved)
      :  [
  { date: "2026-04-01", amount: 5000, category: "Salary", type: "Income" },
  { date: "2026-04-02", amount: 1000, category: "shopping", type: "Expense" },
  { date: "2026-04-03", amount: 500, category: "bills", type: "Expense" },
  { date: "2026-04-04", amount: 200, category: "food", type: "Expense" }
];
  });

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("Expense");
  const [editIndex, setEditIndex] = useState(null);
  const [role, setRole] = useState("admin");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [date, setDate] = useState(" ");

  // calculations
  const income = transactions
    .filter(t => t.type === "Income")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const expense = transactions
    .filter(t => t.type === "Expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const balance = income - expense;
  

  // save to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // chart data (FIXED)
  const chartData = Object.values(
    transactions.reduce((acc, t) => {
      if (t.type === "Expense" && t.category && Number(t.amount) > 0) {
        const cat = t.category.toLowerCase();

        if (!acc[cat]) {
          acc[cat] = { name: cat, value: 0 };
        }

        acc[cat].value += Number(t.amount);
      }
      return acc;
    }, {})
  );
  const timeData = Object.values(
  transactions.reduce((acc, t) => {
    if (!acc[t.date]) {
      acc[t.date] = { date: t.date, amount: 0 };
    }
    acc[t.date].amount += Number(t.amount);
    return acc;
  }, {})
);
  
  const highest =
  chartData && chartData.length > 0
    ? chartData.reduce((prev, curr) =>
        prev.value > curr.value ? prev : curr
      )
    : null;
    
  return (
    <div
  style={{
    padding: "20px",
    background: darkMode ? "#0f172a" : "#ffffff",
    color: darkMode ? "white" : "black",
    minHeight: "100vh"
  }}
>
      
      <h1 style={{ color: darkMode ? "white" : "#1e293b" }}>
  Finance Dashboard
</h1>
      <button onClick={() => setDarkMode(!darkMode)}>
  {darkMode ? "Light Mode" : "Dark Mode"}
</button>
      <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  style={{ marginTop: "10px", padding: "5px" }}
>
  <option value="admin">Admin</option>
  <option value="viewer">Viewer</option>
</select>

      {/* Cards */}
      <div style={{
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  margin: "20px 0"
}}>
        <div style={{
  background: darkMode ? "#1e293b" : "#ffffff",
  color: darkMode ? "white" : "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: darkMode
    ? "0 4px 10px rgba(0,0,0,0.4)"
    : "0 4px 10px rgba(0,0,0,0.1)",
  border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb",
  minWidth: "150px",
  textAlign: "center"
}}>
  Balance: ₹{balance}
</div>

<div style={{
  background: darkMode ? "#1e293b" : "#ffffff",
  color: darkMode ? "white" : "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: darkMode
    ? "0 4px 10px rgba(0,0,0,0.4)"
    : "0 4px 10px rgba(0,0,0,0.1)",
  border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb",
  minWidth: "150px",
  textAlign: "center"
}}>
  Income: ₹{income}
</div>

<div style={{
  background: darkMode ? "#1e293b" : "#ffffff",
  color: darkMode ? "white" : "#1e293b",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: darkMode
    ? "0 4px 10px rgba(0,0,0,0.4)"
    : "0 4px 10px rgba(0,0,0,0.1)",
  border: darkMode ? "1px solid #334155" : "1px solid #e5e7eb",
  minWidth: "150px",
  textAlign: "center"
}}>
  Expense: ₹{expense}
</div>
      </div>

      {/* Inputs */}
      <h2
  style={{
    marginTop: "30px",
    color: darkMode ? "white" : "#1e293b",
    fontWeight: "600",
    letterSpacing: "0.5px"
  }}
>
  Transactions
</h2>

      <div style={{ marginTop: "20px" }}>
        <input
  placeholder="Search category..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{ padding: "8px", marginRight: "10px" }}
/>
        <input
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  style={{
    padding: "8px",
    marginRight: "10px"
  }}
/>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        >
          <option>Income</option>
          <option>Expense</option>
        </select>

        <button
          onClick={() => {
            if (!amount || !category) return;

            const newTransaction = {
              date: date || new 
              Date().toISOString().split("T")[0],
              amount,
              category,
              type
            };

            if (editIndex !== null) {
              const updated = [...transactions];
              updated[editIndex] = newTransaction;
              setTransactions(updated);
              setEditIndex(null);
            } else {
              setTransactions([...transactions, newTransaction]);
            }

            setAmount("");
            setCategory("");
            setDate("");
            setType("Expense");
          }}
          style={{
  padding: "8px 12px",
  background: editIndex !== null ? "#16a34a" : "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
}}
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Table */}
      <table style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={{ fontWeight: "600", color: darkMode ? "white" : "#1e293b" }}>
  Date
</th>

<th style={{ fontWeight: "600", color: darkMode ? "white" : "#1e293b" }}>
  Amount
</th>

<th style={{ fontWeight: "600", color: darkMode ? "white" : "#1e293b" }}>
  Category
</th>

<th style={{ fontWeight: "600", color: darkMode ? "white" : "#1e293b" }}>
  Type
</th>

<th style={{ fontWeight: "600", color: darkMode ? "white" : "#1e293b" }}>
  Action
</th>
          </tr>
        </thead>

        <tbody>
          {transactions
  .filter((t) =>
    search === ""
      ? true
      : (t.category || "")
          .toLowerCase()
          .includes(search.toLowerCase())
  )
  .map((t, index) => (
  
            <tr key={index}>
              <td>{t.date}</td>
              <td>₹{t.amount}</td>
              <td>{t.category}</td>
              <td>{t.type}</td>

              {role === "admin" && (
  <>
    <button
      onClick={() => {
        setAmount(t.amount);
        setCategory(t.category);
        setType(t.type);
        setEditIndex(index);
      }}
      style={{ marginRight: "5px", background: "orange", color: "white" }}
    >
      Edit
    </button>

    <button
      onClick={() => {
        const updated = transactions.filter((_, i) => i !== index);
        setTransactions(updated);
      }}
      style={{ background: "red", color: "white" }}
    >
      Delete
    </button>
  </>
)}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chart */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, value }) => `${name}: ₹${value}`}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={["#22c55e", "#3b82f6", "#f97316", "#ef4444"][index % 4]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
  <LineChart width={500} height={300} data={timeData}>
    <XAxis dataKey="date" />
    <YAxis />
    <CartesianGrid stroke="#ccc" />
    <Line type="monotone" dataKey="amount" stroke="#22c55e" />
  </LineChart>
</div>
      </div>
      <div style={{ marginTop: "20px", textAlign: "center" }}>
  <h3>Insights</h3>

  {highest ? (
    <p>
      Top Spending: {highest.name} (₹{highest.value})
      Total Transaction:{transactions.length}
    </p>
  
  ) : (
    <p>No data available</p>
  )}
</div>
      

    </div>
  );
}

export default App;