import React, {useEffect, useMemo, useRef, useState} from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
} from "mdb-react-ui-kit";
import { io } from 'socket.io-client';
import { useHotKey } from "./hooks/useHotKey";

const listChat = [
  {
    room: 'chat1',
    name: 'bee bee',
    user_id: '1'
  },
  {
    room: 'chat2',
    name: 'bi',
    user_id: '2'
  },
  {
    room: 'chat3',
    name: 'bông',
    user_id: '3'
  },
  {
    room: 'chat4',
    name: 'tùng',
    user_id: '4'
  },
];

export default function App(props) {
  const inputRef = useRef();
  const [chatContent, setChatContent] = useState([])
  const [typingPerson, setTypingPerson] = useState({ isTyping: false });
  const [roomDetail, setRoomDetail] = useState({
    room: 'chat',
    name: '',
    user_id: '-1'
  });
  const isTypingBeforeRef = useRef(false);

  const siteUrl = window.location.search;
  const urlParams = new URLSearchParams(siteUrl);

  const room = roomDetail.room;
  const userName = urlParams.get('name');
  const userId = urlParams.get('user_id');

  const socket = useMemo(() => {
    return io('http://localhost:4000', {
      auth: {
        user_id: userId,
        user_name: userName
      }
    })
  }, [userId, userName]);

  useEffect(() => {
    socket.emit('join-room', {
      room: room,
    });
  }, [room])

  useEffect(() => {
    socket.on('chat-message', function(data) {
      const d = new Date();
      const content = {
        icon_profile: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp',
        text: data.msg,
        time: d.toLocaleString(),
        userId: data.user_id
      }
      console.log(chatContent);
      setChatContent([...chatContent, content]);
    });

    socket.on('typing', function (data) {
      setTypingPerson({
        user_id: data.user_id,
        user_name: data.user_name,
        isTyping: data.isTyping,
      })
    })
  }, [chatContent])

  const sendTypingForSocket = (isTyping) => {
    if (isTypingBeforeRef.current !== isTyping) {
      socket.emit('typing', isTyping)
      isTypingBeforeRef.current = isTyping;
    }
  }

  useEffect(() => {
    inputRef.current?.addEventListener('input', (e) => {
      const isTypingEl = e.target.value.length > 0;
      sendTypingForSocket(isTypingEl);
    })
    return () => {
      inputRef.current?.removeEventListener('input', () => {})
    }
  }, [])

  const handleOnSendMessage = () => {
    if (inputRef.current.value === '') return;
    socket.emit('chat-message', inputRef.current.value);
    inputRef.current.value = '';
    sendTypingForSocket(false);
  }

  const handleOnClickToSendMessage = () => {
    handleOnSendMessage();
  }

  useHotKey({
    cb: handleOnSendMessage,
    ref: inputRef,
    key: 'Enter'
  })

  const leftRoom = (data) => {
    socket.emit('left-room', data)
  }

  const handleOnChangeChannel = (data) => {
    leftRoom(roomDetail.room);
    setRoomDetail(data)
    setChatContent([]);
  }

  return (
      <MDBContainer fluid className="py-5" style={{ backgroundColor: "#CDC4F9" }}>
        <MDBRow>
          <MDBCol md="12">
            <MDBCard id="chat3" style={{ borderRadius: "15px" }}>
              <MDBCardBody>
                <MDBRow>
                  <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                    <div className="p-3">
                      <MDBInputGroup className="rounded mb-3">
                        <input
                            className="form-control rounded"
                            placeholder="Search"
                            type="search"
                        />
                        <span
                            className="input-group-text border-0"
                            id="search-addon"
                        >
                        <MDBIcon fas icon="search" />
                      </span>
                      </MDBInputGroup>

                      <div
                          style={{ position: "relative", height: "400px", overflow: "scroll" }}
                      >
                        <MDBTypography listUnStyled className="mb-0">
                          {listChat.map((data) => {
                            return (<li className="p-2 border-bottom">
                              <a
                                  href="#!"
                                  className="d-flex justify-content-between"
                                  onClick={() => {
                                    handleOnChangeChannel(data);
                                  }}
                              >
                                <div className="d-flex flex-row">
                                  <div>
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                        alt="avatar"
                                        className="d-flex align-self-center me-3"
                                        width="60"
                                    />
                                    <span className="badge bg-success badge-dot"></span>
                                  </div>
                                  <div className="pt-1">
                                    <p className="fw-bold mb-0">{data.name}</p>
                                    <p className="small text-muted">
                                      Hello, Are you there?
                                    </p>
                                  </div>
                                </div>
                                <div className="pt-1">
                                  <p className="small text-muted mb-1">Just now</p>
                                  <span className="badge bg-danger rounded-pill float-end">
                                    3
                                  </span>
                                </div>
                              </a>
                            </li>)
                          })}
                          {/*<li className="p-2 border-bottom">*/}
                          {/*  <a*/}
                          {/*      href="#!"*/}
                          {/*      className="d-flex justify-content-between"*/}
                          {/*  >*/}
                          {/*    <div className="d-flex flex-row">*/}
                          {/*      <div>*/}
                          {/*        <img*/}
                          {/*            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"*/}
                          {/*            alt="avatar"*/}
                          {/*            className="d-flex align-self-center me-3"*/}
                          {/*            width="60"*/}
                          {/*        />*/}
                          {/*        <span className="badge bg-success badge-dot"></span>*/}
                          {/*      </div>*/}
                          {/*      <div className="pt-1">*/}
                          {/*        <p className="fw-bold mb-0">Marie Horwitz</p>*/}
                          {/*        <p className="small text-muted">*/}
                          {/*          Hello, Are you there?*/}
                          {/*        </p>*/}
                          {/*      </div>*/}
                          {/*    </div>*/}
                          {/*    <div className="pt-1">*/}
                          {/*      <p className="small text-muted mb-1">Just now</p>*/}
                          {/*      <span className="badge bg-danger rounded-pill float-end">*/}
                          {/*      3*/}
                          {/*    </span>*/}
                          {/*    </div>*/}
                          {/*  </a>*/}
                          {/*</li>*/}
                          {/*<li className="p-2 border-bottom">*/}
                          {/*  <a*/}
                          {/*      href="#!"*/}
                          {/*      className="d-flex justify-content-between"*/}
                          {/*  >*/}
                          {/*    <div className="d-flex flex-row">*/}
                          {/*      <div>*/}
                          {/*        <img*/}
                          {/*            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"*/}
                          {/*            alt="avatar"*/}
                          {/*            className="d-flex align-self-center me-3"*/}
                          {/*            width="60"*/}
                          {/*        />*/}
                          {/*        <span className="badge bg-warning badge-dot"></span>*/}
                          {/*      </div>*/}
                          {/*      <div className="pt-1">*/}
                          {/*        <p className="fw-bold mb-0">Alexa Chung</p>*/}
                          {/*        <p className="small text-muted">*/}
                          {/*          Lorem ipsum dolor sit.*/}
                          {/*        </p>*/}
                          {/*      </div>*/}
                          {/*    </div>*/}
                          {/*    <div className="pt-1">*/}
                          {/*      <p className="small text-muted mb-1">*/}
                          {/*        5 mins ago*/}
                          {/*      </p>*/}
                          {/*      <span className="badge bg-danger rounded-pill float-end">*/}
                          {/*      2*/}
                          {/*    </span>*/}
                          {/*    </div>*/}
                          {/*  </a>*/}
                          {/*</li>*/}
                          {/*<li className="p-2 border-bottom">*/}
                          {/*  <a*/}
                          {/*      href="#!"*/}
                          {/*      className="d-flex justify-content-between"*/}
                          {/*  >*/}
                          {/*    <div className="d-flex flex-row">*/}
                          {/*      <div>*/}
                          {/*        <img*/}
                          {/*            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp"*/}
                          {/*            alt="avatar"*/}
                          {/*            className="d-flex align-self-center me-3"*/}
                          {/*            width="60"*/}
                          {/*        />*/}
                          {/*        <span className="badge bg-success badge-dot"></span>*/}
                          {/*      </div>*/}
                          {/*      <div className="pt-1">*/}
                          {/*        <p className="fw-bold mb-0">Danny McChain</p>*/}
                          {/*        <p className="small text-muted">*/}
                          {/*          Lorem ipsum dolor sit.*/}
                          {/*        </p>*/}
                          {/*      </div>*/}
                          {/*    </div>*/}
                          {/*    <div className="pt-1">*/}
                          {/*      <p className="small text-muted mb-1">Yesterday</p>*/}
                          {/*    </div>*/}
                          {/*  </a>*/}
                          {/*</li>*/}
                          {/*<li className="p-2 border-bottom">*/}
                          {/*  <a*/}
                          {/*      href="#!"*/}
                          {/*      className="d-flex justify-content-between"*/}
                          {/*  >*/}
                          {/*    <div className="d-flex flex-row">*/}
                          {/*      <div>*/}
                          {/*        <img*/}
                          {/*            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava4-bg.webp"*/}
                          {/*            alt="avatar"*/}
                          {/*            className="d-flex align-self-center me-3"*/}
                          {/*            width="60"*/}
                          {/*        />*/}
                          {/*        <span className="badge bg-danger badge-dot"></span>*/}
                          {/*      </div>*/}
                          {/*      <div className="pt-1">*/}
                          {/*        <p className="fw-bold mb-0">Ashley Olsen</p>*/}
                          {/*        <p className="small text-muted">*/}
                          {/*          Lorem ipsum dolor sit.*/}
                          {/*        </p>*/}
                          {/*      </div>*/}
                          {/*    </div>*/}
                          {/*    <div className="pt-1">*/}
                          {/*      <p className="small text-muted mb-1">Yesterday</p>*/}
                          {/*    </div>*/}
                          {/*  </a>*/}
                          {/*</li>*/}
                          {/*<li className="p-2 border-bottom">*/}
                          {/*  <a*/}
                          {/*      href="#!"*/}
                          {/*      className="d-flex justify-content-between"*/}
                          {/*  >*/}
                          {/*    <div className="d-flex flex-row">*/}
                          {/*      <div>*/}
                          {/*        <img*/}
                          {/*            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp"*/}
                          {/*            alt="avatar"*/}
                          {/*            className="d-flex align-self-center me-3"*/}
                          {/*            width="60"*/}
                          {/*        />*/}
                          {/*        <span className="badge bg-warning badge-dot"></span>*/}
                          {/*      </div>*/}
                          {/*      <div className="pt-1">*/}
                          {/*        <p className="fw-bold mb-0">Kate Moss</p>*/}
                          {/*        <p className="small text-muted">*/}
                          {/*          Lorem ipsum dolor sit.*/}
                          {/*        </p>*/}
                          {/*      </div>*/}
                          {/*    </div>*/}
                          {/*    <div className="pt-1">*/}
                          {/*      <p className="small text-muted mb-1">Yesterday</p>*/}
                          {/*    </div>*/}
                          {/*  </a>*/}
                          {/*</li>*/}
                          {/*<li className="p-2">*/}
                          {/*  <a*/}
                          {/*      href="#!"*/}
                          {/*      className="d-flex justify-content-between"*/}
                          {/*  >*/}
                          {/*    <div className="d-flex flex-row">*/}
                          {/*      <div>*/}
                          {/*        <img*/}
                          {/*            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"*/}
                          {/*            alt="avatar"*/}
                          {/*            className="d-flex align-self-center me-3"*/}
                          {/*            width="60"*/}
                          {/*        />*/}
                          {/*        <span className="badge bg-success badge-dot"></span>*/}
                          {/*      </div>*/}
                          {/*      <div className="pt-1">*/}
                          {/*        <p className="fw-bold mb-0">Ben Smith</p>*/}
                          {/*        <p className="small text-muted">*/}
                          {/*          Lorem ipsum dolor sit.*/}
                          {/*        </p>*/}
                          {/*      </div>*/}
                          {/*    </div>*/}
                          {/*    <div className="pt-1">*/}
                          {/*      <p className="small text-muted mb-1">Yesterday</p>*/}
                          {/*    </div>*/}
                          {/*  </a>*/}
                          {/*</li>*/}
                        </MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                  <MDBCol md="6" lg="7" xl="8">
                    <div
                        style={{ position: "relative", height: "400px", overflow: "scroll" }}
                        className="pt-3 pe-3"
                    >
                      {
                        chatContent.map((data) => {
                          if (data.userId !== userId) {
                            return (
                                <div className="d-flex flex-row justify-content-start">
                                  <img
                                      src={data.icon_profile}
                                      alt="avatar 1"
                                      style={{ width: "45px", height: "100%" }}
                                  />
                                  <div>
                                    <p
                                        className="small p-2 ms-3 mb-1 rounded-3"
                                        style={{ backgroundColor: "#f5f6f7" }}
                                    >
                                      {data.text}
                                    </p>
                                    <p className="small ms-3 mb-3 rounded-3 text-muted float-end">
                                      {data.time}
                                    </p>
                                  </div>
                                </div>
                            )
                          }
                          return (
                              <div className="d-flex flex-row justify-content-end">
                                <div>
                                  <p className="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">
                                    {data.text}
                                  </p>
                                  <p className="small me-3 mb-3 rounded-3 text-muted">
                                    {data.time}
                                  </p>
                                </div>
                                <img
                                    src={data.icon_profile}
                                    alt="avatar 1"
                                    style={{ width: "45px", height: "100%" }}
                                />
                              </div>
                          )
                        })
                      }
                    </div>
                    <div className="text-muted d-flex justify-content-start align-items-center pe-3 pt-3 mt-2">
                      <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp"
                          alt="avatar 3"
                          style={{ width: "40px", height: "100%" }}
                      />
                      <input
                          type="text"
                          className="form-control form-control-lg"
                          id="exampleFormControlInput2"
                          placeholder="Type message"
                          ref={inputRef}
                      />
                      <a className="ms-1 text-muted" href="#!">
                        <MDBIcon fas icon="paperclip" />
                      </a>
                      <a className="ms-3 text-muted" href="#!">
                        <MDBIcon fas icon="smile" />
                      </a>
                      <a className="ms-3" onClick={handleOnClickToSendMessage} href="#!">
                        <MDBIcon fas icon="paper-plane" />
                      </a>
                    </div>
                    <div>
                      {
                        typingPerson.isTyping && (typingPerson.user_id !== userId) && (`${typingPerson.user_name} is typing....`)
                      }
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
  );
}