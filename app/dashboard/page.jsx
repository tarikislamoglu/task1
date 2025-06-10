"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addProject,
  setActiveProject,
  addBoardToActiveProject,
  removeBoardFromActiveProject,
  updateBoardComment,
  selectActiveProject,
} from "../features/cartSlice";

import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosArrowForward,
  IoMdClose,
  IoIosNotificationsOutline,
  IoIosSearch,
  IoIosAdd,
} from "react-icons/io";
import { BiMessageDetail } from "react-icons/bi";
import { RiHome6Line } from "react-icons/ri";
import { TiArrowMove } from "react-icons/ti";
import { BsThreeDots } from "react-icons/bs";
import { HiOutlineArrowTopRightOnSquare, HiOutlineStar } from "react-icons/hi2";
import { IoFilter } from "react-icons/io5";

import DateRangeBox from "../components/DateRangeBox";
import SelectAvatar from "../components/SelectAvatar";
import SelectFlag from "../components/SelectFlag";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart.cart);
  const activeProject = useSelector(selectActiveProject);

  // Diğer state’ler
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [commentValue, setCommentValue] = useState("");
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [selectedFlag, setSelectedFlag] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserEmail(payload.email);
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleCreateProject = () => {
    const newProject = {
      id: crypto.randomUUID(),
      name: `Proje ${cart.length + 1}`,
      boards: [],
    };
    dispatch(addProject(newProject));
  };

  const handleAddBoard = () => {
    if (!activeProject) return;
    dispatch(
      addBoardToActiveProject({
        id: crypto.randomUUID(),
        title: `Board ${activeProject.boards.length + 1}`,
        comments: [],
      })
    );
  };

  const selectedBoard = activeProject?.boards.find(
    (b) => b.id === selectedBoardId
  );

  return (
    <div className="flex md:flex-row flex-col">
      <aside className="md:w-1/5 w-full bg-white flex flex-col md:flex-row md:h-screen">
        <div className="md:w-1/5 w-full bg-blue-900 text-[#667085] p-4 flex  md:flex-col  justify-between items-center">
          <div className="space-y-5 flex md:flex-col">
            <IoIosNotificationsOutline className="w-6 h-6" />
            <IoIosNotificationsOutline className="w-6 h-6" />
            <IoIosNotificationsOutline className="w-6 h-6" />
            <IoIosNotificationsOutline className="w-6 h-6" />
          </div>
          <div className="space-y-5 flex md:flex-col">
            <IoIosNotificationsOutline className="w-6 h-6" />
            <IoIosNotificationsOutline className="w-6 h-6" />
            <IoIosNotificationsOutline className="w-6 h-6" />
            <IoIosNotificationsOutline className="w-6 h-6" />
            <img src="profile1.png" className="w-6 h-6 bg-white rounded-full" />
          </div>
        </div>
        <div className="w-full md:w-4/5 p-2 flex md:flex-col md:justify-between ">
          <div className="flex md:flex-col ">
            <h2 className="text-xl font-bold md:mb-4 md:block hidden">
              Projeler
            </h2>
            <div className="flex md:flex-col flex-wrap ">
              {cart.length > 0 ? (
                cart.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => dispatch(setActiveProject(project.id))}
                    className={`p-2 cursor-pointer rounded mb-2 ${
                      activeProject?.id === project.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {project.name}
                  </div>
                ))
              ) : (
                <p>Henüz proje yok.</p>
              )}
              <button
                onClick={handleCreateProject}
                className="mt-4 bg-green-600 hover:bg-green-500 w-full py-2 rounded text-white"
              >
                + Proje Oluştur
              </button>
            </div>
          </div>
          <div className="md:block hidden">
            <p>{userEmail}</p>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="text-red-300 mt-2 underline"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      <main className="md:w-4/5 w-full p-6 bg-sky-100">
        <h1 className="text-2xl font-bold mb-4">Frontend Case</h1>

        {activeProject ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {activeProject.name} - Boards
            </h2>
            <ul className="flex gap-4 overflow-x-auto p-4 bg-white rounded shadow">
              {activeProject.boards.map((board) => (
                <li key={board.id}>
                  <div className="w-[300px] h-[500px] bg-gray-50 p-4 rounded shadow">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{board.title}</h3>
                      <button
                        onClick={() =>
                          dispatch(removeBoardFromActiveProject(board.id))
                        }
                      >
                        X
                      </button>
                    </div>

                    <div className="mt-2 text-sm  max-h-[180px]">
                      {board.comments.length > 0 ? (
                        <div className="overflow-y-auto">
                          {board.comments.map((c, idx) => {
                            return (
                              <div
                                key={idx}
                                className="p-2 bg-white border rounded mb-1  space-y-2"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {c.avatars.map(({ id, src, name }) => (
                                    <img
                                      key={id}
                                      src={src}
                                      className="w-5 h-5 rounded-full border"
                                      title={name}
                                      alt={name}
                                    />
                                  ))}
                                </div>
                                <p>{c.text}</p>
                                <p className="text-xs italic text-gray-500">
                                  {new Date(
                                    c.dateRange.startDate
                                  ).toLocaleDateString()}
                                  -
                                  {new Date(
                                    c.dateRange.endDate
                                  ).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-700 flex space-x-3">
                                  <span> Milestone Name</span>
                                  <img src={c.flag.src} />
                                </p>
                              </div>
                            );
                          })}
                          <button
                            className="bg-blue-600 text-white w-full py-1 rounded cursor-pointer"
                            onClick={() => {
                              setSelectedBoardId(board.id);
                              setIsModalOpen(true);
                            }}
                          >
                            + Task Ekle
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col justify-center">
                          <img src="layer1.png" className="mb-4" />
                          <button
                            className="bg-blue-600 text-white w-full py-1 rounded cursor-pointer"
                            onClick={() => {
                              setSelectedBoardId(board.id);
                              setIsModalOpen(true);
                            }}
                          >
                            + Task Ekle
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
              <li className="w-[300px] h-[500px] flex justify-center items-center">
                <button
                  onClick={handleAddBoard}
                  className=" bg-blue-600 text-white rounded w-full h-full cursor-pointer"
                >
                  + Board Ekle
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <p>Bir proje seçin</p>
        )}
      </main>

      {isModalOpen && selectedBoard && (
        <div className="fixed inset-0 m-auto w-5/6 h-2/3 bg-white p-5 space-y-10 overflow-auto  shadow-lg rounded flex flex-col">
          <div className="flex md:justify-between flex-col items-center md:flex-row space-y-5 md:space-y-0">
            <div className="flex items-center space-x-3">
              <IoIosArrowUp />
              <IoIosArrowDown />
              <RiHome6Line />
              <IoIosArrowForward />
              <p>Projeler</p>
              <IoIosArrowForward />
              <p>{activeProject.name}</p>
              <IoIosArrowForward />
              <p>{selectedBoard.title}</p>
              <TiArrowMove />
            </div>
            <div className="flex space-x-3 items-center">
              <BsThreeDots />
              <HiOutlineArrowTopRightOnSquare />
              <HiOutlineStar />
              <IoMdClose onClick={() => setIsModalOpen(false)} />
            </div>
          </div>

          <div className="flex md:flex-row flex-col space-x-2">
            <div className="md:w-2/3">
              <div className="flex justify-between">
                <p>ID:#{selectedBoard.id}</p>
                <DateRangeBox
                  selected={selectedDateRange}
                  setSelected={setSelectedDateRange}
                />
              </div>
              <div className="flex justify-between md:w-2/3">
                <div>
                  <h2>Task Status</h2>
                  <p>Open</p>
                </div>

                <div>
                  <h2>Assignments</h2>
                  <SelectAvatar
                    selected={selectedAvatars}
                    setSelected={setSelectedAvatars}
                  />
                </div>
                <div>
                  <h2>Priority</h2>
                  <SelectFlag
                    selected={selectedFlag}
                    setSelected={setSelectedFlag}
                  />
                </div>
              </div>
              <div className="relative">
                <h3 className="font-semibold mt-4">Yorumlar</h3>
                <textarea
                  className="w-full p-2 border rounded mt-2 h-[150px]"
                  placeholder="Yorum ekle..."
                  value={commentValue}
                  onChange={(e) => setCommentValue(e.target.value)}
                />
                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded absolute bottom-1 right-0"
                  onClick={() => {
                    dispatch(
                      updateBoardComment({
                        boardId: selectedBoard.id,
                        comment: {
                          text: commentValue,
                          avatars: selectedAvatars,
                          flag: selectedFlag,
                          dateRange: {
                            startDate: selectedDateRange.startDate.toString(),
                            endDate: selectedDateRange.endDate.toString(),
                          },
                        },
                      })
                    );
                    setCommentValue("");
                    setSelectedAvatars([]);
                    setSelectedFlag("");
                    setSelectedDateRange({ startDate: "", endDate: "" });
                    setIsModalOpen(false);
                  }}
                >
                  Gönder
                </button>
              </div>
            </div>

            <div className="md:w-1/3 flex space-x-1">
              <div className="w-4/5 border-1 border-gray-200">
                <div className="flex justify-between">
                  <h2>Activity</h2>
                  <div className="flex">
                    <IoIosSearch />
                    <IoFilter />
                  </div>
                </div>
                <div className="overflow-y-scroll">
                  {[
                    {
                      src: "profile5.png",
                      user: "Lana Steiner",
                      time: "2 mins ago",
                      action: "İnvited Alisa Hester to the team.",
                    },
                    {
                      src: "profile6.png",
                      user: "Demi Wilkinson",
                      time: "2 mins ago",
                      action: "İnvited Alisa Hester to the team.",
                    },
                    {
                      src: "profile7.png",
                      user: "Candince Wu",
                      time: "3 hours ago",
                      action: "İnvited Alisa Hester to the team.",
                    },
                    {
                      src: "profile8.png",
                      user: "Natali Craig",
                      time: "3 hours ago",
                      action: "İnvited Alisa Hester to the team.",
                    },
                    {
                      src: "profile9.png",
                      user: "Natali Craig",
                      time: "6 hours ago",
                      action: "İnvited Alisa Hester to the team.",
                    },
                    {
                      src: "profile10.png",
                      user: "Orlando Diggs",
                      time: "6 hours ago",
                      action: "İnvited Alisa Hester to the team.",
                    },
                    {
                      src: "profile11.png",
                      user: "Drew Cano",
                      time: "11 hours ago",
                      action: "İnvited Alisa Hester to the team.",
                    },
                    {
                      src: "profile11.png",
                      user: "Lana Steiner",
                      time: "12 hours ago",
                      action: "İnvited Alisa Hester to the team.",
                    },
                  ].map(({ src, user, time, action }, index) => {
                    return (
                      <div className="flex text-xs" key={index}>
                        <img src={src} className="w-6 h-6 rounded-full" />
                        <div className="flex flex-col">
                          <div className="flex">
                            <h2>{user}</h2>
                            <span className="text-gray-500">{time}</span>
                          </div>
                          <p>{action}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="w-1/5 space-y-4 items-center flex flex-col text-[#667085] border-1 border-gray-200 overflow-auto ">
                {["Activity", "Condition", "QA", "Meetings", "Docs", " "].map(
                  (msg, index) => {
                    return (
                      <div
                        className="flex flex-col items-center justify-center"
                        key={index}
                      >
                        <BiMessageDetail className="w-6 h-6  bg-gray-100 rounded-full" />
                        <p className="text-xs">{msg}</p>
                      </div>
                    );
                  }
                )}
                <IoIosAdd className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
