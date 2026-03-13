import UserSearchItem from "../components/UserSearchItem";

export default function MoneyTransfer() {
  return (
    <div className="pt-20 pb-20 max-w-md mx-auto px-4">
      
      <h1 className="text-2xl font-bold mb-6">Send Money</h1>

      <input 
        type="text"
        placeholder="Search user..."
        className="w-full mb-4 p-3 border rounded-lg"
      />
      
      <UserSearchItem name="ahmed_user" avatar="https://i.pravatar.cc/150" />

      <input 
        type="number"
        placeholder="Amount"
        className="w-full mb-4 p-3 border rounded-lg"
      />

      <input 
        type="text"
        placeholder="Note (optional)"
        className="w-full mb-4 p-3 border rounded-lg"
      />

      <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
        Send
      </button>

    </div>
  );
}