import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import "./AthleteLinkCard.css";
import {database} from "../../firebase";

const AthleteLinkCards = () => {
  const [people, setPeople] = useState([]);
  const [currentPerson, setCurrentPerson] = useState({
    name: "initialName",
  });
  useEffect(() => {
    const unsubscribe = database
      .collection("users")
      .onSnapshot((snapshot) =>
        setPeople(snapshot.docs.map((doc) => doc.data()))
      );
    return () => {
      // cleanup
      unsubscribe();
    };
  }, []);

  return (
    <div key={currentPerson.name}>
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
              <h3>{person.firstName + " " + person.lastName}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default AthleteLinkCards;