import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import "./AthleteLinkCards.css";
import { database } from "../../firebase";

const AthleteLinkCards = (props) => {
  const { data } = props;
  const [people, setPeople] = useState([]);
  const [currentPerson, setCurrentPerson] = useState({
    name: "initialName",
  });
  // useEffect(() => {
  //   const unsubscribe = database
  //     .collection("users")
  //     .onSnapshot((snapshot) =>
  //       setPeople(snapshot.docs.map((doc) => doc.data()))
  //     );
  //   return () => {
  //     // cleanup
  //     unsubscribe();
  //   };
  // }, []);

  return (
    <div key={currentPerson.name}>
      <div className="athleteLinkCards__cardContainer">
        {data.map(
          (person) => {
            console.log("person")(<h1>person</h1>);
          }

          // console.log(person.name)
          // console.log(person)

          // <TinderCard
          //   className="swipe"
          //   key={person.name}
          //   preventSwipe={["up", "down"]}
          // >
          //   <div
          //     style={{ backgroundImage: `url(${person.url})` }}
          //     className="card"
          //   >
          //     <h3>{person.firstName + " " + person.lastName}</h3>
          //   </div>
          // </TinderCard>
        )}
      </div>
    </div>
  );
};

export default AthleteLinkCards;
