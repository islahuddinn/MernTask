import { ReactNode } from "react";
import { Box, Flex, Button, useDisclosure, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../../Redux/users/user.types";

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { auth, token, loading, error } = useSelector(
    (state) => state.userReducer
  );
  console.log(auth);

  const nav = useNavigate();
  return (
    <>
      <Box
        zIndex={1000}
        position={"fixed"}
        top={0}
        w={"100%"}
        boxShadow={
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;"
        }
        bg={"yellowgreen"}
        px={4}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box
            fontWeight={"bold"}
            cursor={"pointer"}
            onClick={() => {
              nav("/");
            }}
            color="white"
          >
            Test Notes App
          </Box>

          <Flex alignItems={"center"}>
            <Stack alignItems={"center"} direction={"row"} spacing={7}>
              <Button
                display={auth === true ? "block" : "none"}
                bg={"yellow"}
                m
                color={"green"}
                onClick={() => {
                  nav("/notes");
                }}
              >
                All Notes
              </Button>
              <Button
                display={auth == true ? "none" : "block"}
                bg={"yellow"}
                m
                color={"green"}
                onClick={() => {
                  nav("/register");
                }}
              >
                Sign up
              </Button>
              <Button
                display={auth == true ? "none" : "block"}
                bg={"yellow"}
                m
                color={"green"}
                onClick={() => {
                  nav("/login");
                }}
              >
                Login
              </Button>

              <Button
                bg={"yellow"}
                m
                color={"green"}
                onClick={() => {
                  dispatch({ type: LOGOUT });
                }}
              >
                Logout
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
