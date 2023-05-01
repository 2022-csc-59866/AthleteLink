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

  // const cardStyle = {
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "flex-end",
  //   height: "100%",
  //   padding: "1rem",
  // };

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
    padding: "1rem",
    marginTop: "5px",
  };

  const textStyle = {
    fontWeight: "normal",
    fontSize: "16px",
    margin: "0",
  };

  const textStyleBold = {
    fontWeight: "bold",
    fontSize: "16px",
    margin: "0",
  };

  const titleStyle = {
    fontWeight: "bold",
    fontSize: "24px",
    margin: "0",
  };

  return (
    <div key={currentPerson.name}>
      <div className="athleteLinkCards__cardContainer">
        {data &&
          data.map((person) => (
            <TinderCard
              className="swipe"
              key={person.data.username}
              preventSwipe={["up", "down"]}
            >
              <div
                style={
                  person.data.cardImgUrl
                    ? { backgroundImage: `url(${person.data.cardImgUrl})` }
                    : {
                        background: "hsla(46, 95%, 56%, 1)",
                        background:
                          "linear-gradient(90deg, hsla(46, 95%, 56%, 1) 0%, hsla(350, 97%, 65%, 1) 100%)",
                        background:
                          "-moz-linear-gradient(90deg, hsla(46, 95%, 56%, 1) 0%, hsla(350, 97%, 65%, 1) 100%)",
                        background:
                          "-webkit-linear-gradient(90deg, hsla(46, 95%, 56%, 1) 0%, hsla(350, 97%, 65%, 1) 100%)",
                        filter:
                          "progid: DXImageTransform.Microsoft.gradient( startColorstr='#F9C823', endColorstr='#FC506E', GradientType=1 )",
                      }
                }
                className="card"
              >
                {/* <h3>{person.data.username}</h3> */}
                {/* <h3>{person.data.bio}</h3> */}
              </div>
              <div style={contentStyle} className="card_bottom">
                <h2 style={titleStyle}>{person.data.username}</h2>
                <p>
                  <span style={textStyleBold}>About Me:</span>{" "}
                  <span style={textStyle}>{person.data.bio}</span>
                </p>
                <p>
                  <span style={textStyleBold}>Sports:</span>{" "}
                  <span style={textStyle}>{person.data.sports.join(", ")}</span>
                </p>
                <p>
                  <span style={textStyleBold}>Gender:</span>{" "}
                  <span style={textStyle}>Male</span>
                </p>
              </div>
            </TinderCard>
          ))}
      </div>
    </div>
  );
};

export default AthleteLinkCards;
