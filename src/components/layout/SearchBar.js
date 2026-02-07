import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Apis, { endpoints } from "../../configs/Apis";
import { ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Avatar from './Avatar';

export default function SearchBar() {
  const [kw, setKw] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const validateSearch = () => {
      return kw.trim().length > 0;
    };

    const loadUsers = async () => {
      if (!validateSearch()) {
        setResults([]);
        return;
      }

      try {
        let url = `${endpoints["find-user"]}?name=${kw}`;
        console.info(url);

        let res = await Apis.get(url);
        setResults(res.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };

    const timer = setTimeout(() => {
      loadUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [kw]);

  const handleClickUser = (userId) => {
    navigate(`/user-profile/${userId}`);
    setKw("");
    setResults([]);
  };

  return (
    <div style={{ position: "relative" }}>
      <TextField
        size="small"
        placeholder="Tìm kiếm..."
        variant="outlined"
        value={kw}
        onChange={(e) => setKw(e.target.value)}
        sx={{ width: 300, backgroundColor: "white", borderRadius: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {results.length > 0 && (
        <ListGroup
          style={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {results.map((u) => (
            <ListGroup.Item
              key={u.id}
              action
              onClick={() => handleClickUser(u.id)}
              className="d-flex align-items-center gap-2"
            >
              <Avatar src={u?.avatar} size={32} />
              <span>
                {u.firstName} {u.lastName}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
