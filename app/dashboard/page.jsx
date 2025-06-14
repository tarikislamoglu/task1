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

//icons
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

//components
import DateRangeBox from "../components/DateRangeBox";
import SelectAvatar from "../components/SelectAvatar";
import SelectFlag from "../components/SelectFlag";
import useDragScroll from "../components/useDragScroll";

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const scrollRef = useDragScroll();

  const cart = useSelector((state) => state.cart.cart);
  const activeProject = useSelector(selectActiveProject);

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
  const [taskError, setTaskError] = useState("");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newBoardName, setNewBoardName] = useState("");
  const [projectError, setProjectError] = useState("");
  const [boardError, setBoardError] = useState("");
  const [viewMode, setViewMode] = useState("boards"); // "boards" or "lists"

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (!res.ok) {
          router.push("/login");
          return;
        }

        setUserEmail(data.user.email);
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  const handleCreateProject = () => {
    setProjectError("");
    if (!newProjectName.trim()) {
      setProjectError("Lütfen proje adı girin");
      return;
    }
    const newProject = {
      id: crypto.randomUUID(),
      name: newProjectName.trim(),
      boards: [],
    };
    dispatch(addProject(newProject));
    setNewProjectName("");
    setIsProjectModalOpen(false);
  };

  const handleAddBoard = () => {
    if (!activeProject) return;
    setBoardError("");
    if (!newBoardName.trim()) {
      setBoardError("Lütfen board adı girin");
      return;
    }
    dispatch(
      addBoardToActiveProject({
        id: crypto.randomUUID(),
        title: newBoardName.trim(),
        comments: [],
      })
    );
    setNewBoardName("");
    setIsBoardModalOpen(false);
  };

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });
    router.push("/login");
  }

  const selectedBoard = activeProject?.boards.find(
    (b) => b.id === selectedBoardId
  );

  const handleAddTask = () => {
    setTaskError("");

    // Validate all required fields
    if (!commentValue.trim()) {
      setTaskError("Lütfen bir yorum ekleyin");
      return;
    }
    if (selectedAvatars.length === 0) {
      setTaskError("Lütfen en az bir kişi seçin");
      return;
    }
    if (!selectedFlag) {
      setTaskError("Lütfen bir öncelik seviyesi seçin");
      return;
    }
    if (!selectedDateRange.startDate || !selectedDateRange.endDate) {
      setTaskError("Lütfen tarih aralığı seçin");
      return;
    }

    // If all validations pass, add the task
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

    // Reset form
    setCommentValue("");
    setSelectedAvatars([]);
    setSelectedFlag("");
    setSelectedDateRange({ startDate: "", endDate: "" });
    setIsModalOpen(false);
  };

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
                onClick={() => setIsProjectModalOpen(true)}
                className="mt-4 bg-green-600 hover:bg-green-500 w-full py-2 rounded text-white cursor-pointer"
              >
                + Proje Oluştur
              </button>
            </div>
          </div>
          <div className="md:block hidden">
            <p>{userEmail}</p>
            <button
              onClick={handleLogout}
              className="text-red-300 mt-2 underline"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      <main className="md:w-4/5 w-full p-6 bg-sky-100">
        <h1 className="text-2xl font-bold mb-4">Frontend Case</h1>
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode("boards")}
              className={`px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                viewMode === "boards"
                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500"
              }`}
            >
              Boards
            </button>
            <button
              onClick={() => setViewMode("lists")}
              className={`px-4 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer ${
                viewMode === "lists"
                  ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500"
              }`}
            >
              Lists
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer">
              Others
            </button>
          </div>
        </div>

        {activeProject ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              {activeProject.name} -{" "}
              {viewMode === "boards" ? "Boards" : "Lists"}
            </h2>
            {viewMode === "boards" ? (
              <ul
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto p-4 bg-white rounded shadow cursor-grab select-none"
              >
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
                            <img
                              src="layer1.png"
                              className="mb-4"
                              draggable={false}
                            />
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
                <li>
                  <div className="w-[300px] h-[500px] bg-gray-50 p-4 rounded shadow flex justify-center items-center">
                    <button
                      onClick={() => setIsBoardModalOpen(true)}
                      className="w-full h-full flex flex-col justify-center items-center gap-2 text-blue-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                    >
                      <IoIosAdd className="w-8 h-8" />
                      <span className="text-lg font-semibold">Board Ekle</span>
                    </button>
                  </div>
                </li>
              </ul>
            ) : (
              <div className="bg-white rounded shadow">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Board Listesi</h3>
                    <button
                      onClick={() => setIsBoardModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <IoIosAdd className="w-5 h-5" />
                      Board Ekle
                    </button>
                  </div>
                </div>
                <div className="divide-y">
                  {activeProject.boards.map((board) => (
                    <div
                      key={board.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-2">
                            {board.title}
                          </h4>
                          <div className="space-y-2">
                            {board.comments.map((comment, idx) => (
                              <div key={idx} className="bg-gray-50 p-3 rounded">
                                <div className="flex items-center gap-2 mb-2">
                                  {comment.avatars.map(({ id, src, name }) => (
                                    <img
                                      key={id}
                                      src={src}
                                      className="w-5 h-5 rounded-full border"
                                      title={name}
                                      alt={name}
                                    />
                                  ))}
                                </div>
                                <p className="text-sm mb-1">{comment.text}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>
                                    {new Date(
                                      comment.dateRange.startDate
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                      comment.dateRange.endDate
                                    ).toLocaleDateString()}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span>Milestone Name</span>
                                    <img
                                      src={comment.flag.src}
                                      alt={comment.flag.name}
                                      className="w-4 h-4"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBoardId(board.id);
                              setIsModalOpen(true);
                            }}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            Task Ekle
                          </button>
                          <button
                            onClick={() =>
                              dispatch(removeBoardFromActiveProject(board.id))
                            }
                            className="p-1 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <IoMdClose className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                {taskError && (
                  <p className="text-red-500 text-sm mt-2" role="alert">
                    {taskError}
                  </p>
                )}
                <button
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded absolute bottom-1 right-0 hover:bg-blue-700 transition-colors cursor-pointer"
                  onClick={handleAddTask}
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

      {/* Project Creation Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Yeni Proje Oluştur</h3>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Proje adı girin"
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {projectError && (
              <p className="text-red-500 text-sm mb-4">{projectError}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setNewProjectName("");
                  setProjectError("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleCreateProject}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Board Creation Modal */}
      {isBoardModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Yeni Board Oluştur</h3>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board adı girin"
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {boardError && (
              <p className="text-red-500 text-sm mb-4">{boardError}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsBoardModalOpen(false);
                  setNewBoardName("");
                  setBoardError("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleAddBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
