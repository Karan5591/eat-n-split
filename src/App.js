import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Rahul",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Ritika",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Mohit",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowEvent() {
    setShowAddFriend((show) => !show);
    setSelectedFriend(null);
  }

  function handleAddFriend(friend) {
    console.log(friend);
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    selectedFriend === null
      ? setSelectedFriend(friend)
      : friend.id === selectedFriend.id
      ? setSelectedFriend(null)
      : setSelectedFriend(friend);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowEvent}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        Split The Bill with?
      </h1>
      <ul>
        {friends.map((frnds) => (
          <Friend
            friend={frnds}
            key={frnds.id}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  return (
    <>
      <li>
        <img src={friend.image} alt={friend.name} />

        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            you owe {friend.name} {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you
            {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && <p>you and your friend are even.</p>}
        {selectedFriend === null ? (
          <Button onClick={() => onSelection(friend)}>Select</Button>
        ) : (
          <Button onClick={() => onSelection(friend)}>
            {friend.id === selectedFriend.id ? "Close" : "Select"}
          </Button>
        )}
      </li>
    </>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    const newFriend = {
      name,
      image,
      balance: 0,
      id: crypto.randomUUID(),
    };
    console.log(newFriend);
    onAddFriend(newFriend);
    setImage("https://i.pravatar.cc/48");
    setName("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState("");

  const [paidByUSer, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUSer : "";
  const [whoPaying, setWhoPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUSer) return;
    handleSplitBill(whoPaying === "user" ? paidByFriend : -paidByUSer);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split bill with {selectedFriend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>

      <label>Your Expense</label>
      <input
        type="text"
        value={paidByUSer}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUSer : Number(e.target.value)
          )
        }
      ></input>

      <label>{selectedFriend.name} expense</label>
      <input type="text" disabled value={paidByFriend}></input>

      <label>Who is paying the bill?</label>
      <select value={whoPaying} onChange={(e) => setWhoPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="Friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
