import React, { useState } from "react";
import TinderCard from "react-tinder-card";
import "./AthleteLinkCards.css";
const AthleteLinkCards = () => {
  const [people, setPeople] = useState([
    {
      name: "NAME TWO",
      url: "https://addicted2success.com/wp-content/uploads/2017/11/10-Things-We-Can-Learn-From-the-Incredible-Steve-Jobs.jpg",
    },
    {
      name: "NAME ONE ",
      url: "https://www.muscleandfitness.com/wp-content/uploads/2019/05/10-Best-Arms-Olympia-Arnold-Schwarzenegar.jpg?w=940&h=529&crop=1&quality=86&strip=all",
    },
  ]);

  return (
    <div>
      <div className="athleteLinkCards__cardContainer">
        {people.map((person) => (
          <TinderCard
            className="swipe"
            key={person.name}
            preventSwipe={["up", "down"]}
          >
            <div
              style={{ backgroundImage: `url(${person.url})` }}
              className="card"
            >
              <h3>{person.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default AthleteLinkCards;