import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import "./Header.css";
import logo from "../../assets/logo-black.png";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link, useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
const Header = ({ backButton }) => {
  const history = useHistory();
  return (
    <div className="header">
      {backButton ? (
        <IconButton onClick={() => history.replace(backButton)}>
          <ArrowBackIosIcon fontSize="large" className="header__icon" />
        </IconButton>
      ) : (
        <Link to="/myprofile">
          <IconButton>
            <PersonIcon fontSize="large" className="header__icon" />
          </IconButton>
        </Link>
      )}
      <Link to="/">
        <IconButton>
          <HomeIcon fontSize="large" className="header__icon" />
        </IconButton>
      </Link>
      <Link to="/">
        <img className="header__logo" src={logo} alt="AthleteLink" />
      </Link>
      <Link to="/searchGyms">
        <IconButton>
          <SearchIcon fontSize="large" className="header__icon" />
        </IconButton>
      </Link>

      <Link to="/chat">
        <IconButton>
          <QuestionAnswerIcon fontSize="large" className="header__icon" />
        </IconButton>
      </Link>
    </div>
  );
};

export default Header;
