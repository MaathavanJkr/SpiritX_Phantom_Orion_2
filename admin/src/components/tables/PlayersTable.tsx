import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Player } from "../../types/player.type";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import {
  getPlayers,
  updatePlayer,
  deletePlayer,
} from "../../services/player.service";

import { ToastContainer, toast } from "react-toastify";
import Badge from "../ui/badge/Badge";
import { WebsocketContext } from "../../context/WebSocketContext";

export default function PlayersTable() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | null>(
    null
  );
  const [playersData, setPlayersData] = useState<Player[]>([]);

  const handleViewClick = (player: Player) => {
    setSelectedPlayer(player);
    setModalType("view");
    setIsModalOpen(true);
  };

  const handleEditClick = (player: Player) => {
    setSelectedPlayer(player);
    setModalType("edit");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (player: Player) => {
    setSelectedPlayer(player);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
    setModalType(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPlayer) {
      let value: string | number = e.target.value;
      if (e.target.type === "number") {
        if (value === "") {
          value = 0;
        } else {
          value = parseInt(value);
        }
      }
      setSelectedPlayer({
        ...selectedPlayer,
        [e.target.name]: value,
      });
    }
  };

  const handleEditSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (selectedPlayer) {
      setSelectedPlayer({
        ...selectedPlayer,
        [e.target.name]: e.target.value,
      });
    }
  }

  const handleEditSaveChanges = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (selectedPlayer) {
      updatePlayer(selectedPlayer)
        .then(() => {
          toast.success("Player Updated Succesfully");
          setPlayersData((prevPlayers) =>
            prevPlayers.map((player) =>
              player.id === selectedPlayer.id ? selectedPlayer : player
            )
          );
          closeModal();
        })
        .catch((error) => {
          toast.error("Failed to update player " + error);
        });
    }
  };

  const handleDeleteSaveChanges = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (selectedPlayer) {
      deletePlayer(selectedPlayer.id)
        .then(() => {
          toast.success("Player Deleted Succesfully");
          setPlayersData((prevPlayers) =>
            prevPlayers.filter((player) => player.id !== selectedPlayer.id)
          );
          closeModal();
        })
        .catch((error) => {
          toast.error("Failed to delete player " + error);
        });
    }
  }

  useEffect(() => {
    // Fetch players data

    const fetchPlayers = async () => {
      const data = await getPlayers();
      setPlayersData(data);
    };

    fetchPlayers();
  }, []);

  const [ready, val] = useContext(WebsocketContext); // use it just like a hook


  useEffect(() => {
    if (ready && val) {
      console.log("Data received from websocket:", val);
      getPlayers()
        .then((data) => setPlayersData(data))
        .catch((error) => console.error(error)).finally(() => {
          console.log("Data fetched from websocket");
        });
    }
  }, [ready, val]);

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Player Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    University
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Category
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Points
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-1 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {playersData.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-1 py-4 sm:px-6 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {player.name}
                      </span>
                    </TableCell>
                    <TableCell className="px-1 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {player.university}
                    </TableCell>
                    <TableCell className="px-1 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {player.category}
                    </TableCell>
                    <TableCell className="px-1 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {player.points}
                    </TableCell>
                    <TableCell className="px-1 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-1 text-gray-500 hover:text-blue-500 rounded-full"
                          onClick={() => handleViewClick(player)}
                        >
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button
                          className="p-1 text-gray-500 hover:text-yellow-500 rounded-full"
                          onClick={() => handleEditClick(player)}
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          className="p-1 text-gray-500 hover:text-red-500 rounded-full"
                          onClick={() => handleDeleteClick(player)}
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {isModalOpen && selectedPlayer && (
          <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto modal z-99999">
            <div className="modal-close-btn fixed inset-0 h-full w-full bg-gray-400/50 backdrop-blur-sm"></div>
            <div className="relative w-full max-w-[700px] rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10">
              <button
                onClick={closeModal}
                className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
              >
                <svg
                  className="fill-current"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                    fill=""
                  ></path>
                </svg>
              </button>

              <div>
                {modalType === "view" && (
                  <>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                          <span className="text-lg font-medium">
                            {selectedPlayer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{selectedPlayer.name}</h2>
                          <p className="text-muted-foreground">{selectedPlayer.university}</p>
                          <Badge>{selectedPlayer.category}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        {selectedPlayer.category === "Bowler" && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Bowling Statistics</h3>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="bg-gray-200 rounded-lg p-3">
                                <div className="text-sm text-muted-foreground">Wickets</div>
                                <div className="text-2xl font-bold">{selectedPlayer.wickets}</div>
                              </div>
                              <div className="bg-gray-200 rounded-lg p-3">
                                <div className="text-sm text-muted-foreground">Economy Rate</div>
                                <div className="text-2xl font-bold">{selectedPlayer.economy_rate.toFixed(2)}</div>
                              </div>
                              <div className="bg-gray-200 rounded-lg p-3">
                                <div className="text-sm text-muted-foreground">Overs Bowled</div>
                                <div className="text-2xl font-bold">{selectedPlayer.overs_bowled.toFixed(2)}</div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Batting Statistics</h3>
                              <div className="grid grid-cols-4 gap-4">
                                <div className="bg-gray-200 rounded-lg p-3">
                                  <div className="text-sm text-muted-foreground">Total Runs</div>
                                  <div className="text-2xl font-bold">{selectedPlayer.total_runs}</div>
                                </div>
                                <div className="bg-gray-200 rounded-lg p-3">
                                  <div className="text-sm text-muted-foreground">Batting Average</div>
                                  <div className="text-2xl font-bold">{selectedPlayer.batting_average.toFixed(2)}</div>
                                </div>
                                <div className="bg-gray-200 rounded-lg p-3">
                                  <div className="text-sm text-muted-foreground">Strike Rate</div>
                                  <div className="text-2xl font-bold">{selectedPlayer.batting_strike_rate.toFixed(2)}</div>
                                </div>
                                <div className="bg-gray-200 rounded-lg p-3">
                                  <div className="text-sm text-muted-foreground">Innings</div>
                                  <div className="text-2xl font-bold">{selectedPlayer.innings_played}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {(selectedPlayer.category === "All-Rounder" || selectedPlayer.category === "Batsman") && (
                          <div className="space-y-4">
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold">Batting Statistics</h3>
                              <div className="grid grid-cols-4 gap-4">
                                <div className="bg-gray-200 rounded-lg p-3">
                                  <div className="text-sm text-muted-foreground">Total Runs</div>
                                  <div className="text-2xl font-bold">{selectedPlayer.total_runs}</div>
                                </div>
                                <div className="bg-gray-200 rounded-lg p-3">
                                  <div className="text-sm text-muted-foreground">Batting Average</div>
                                  <div className="text-2xl font-bold">{selectedPlayer.batting_average.toFixed(2)}</div>
                                </div>
                                <div className="bg-gray-200 rounded-lg p-3">
                                  <div className="text-sm text-muted-foreground">Strike Rate</div>
                                  <div className="text-2xl font-bold">{selectedPlayer.batting_strike_rate.toFixed(2)}</div>
                                </div>
                                <div className="bg-gray-200 rounded-lg p-3">
                                  <div className="text-sm text-muted-foreground">Innings</div>
                                  <div className="text-2xl font-bold">{selectedPlayer.innings_played}</div>
                                </div>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold">Bowling Statistics</h3>
                            <div className="grid grid-cols-4 gap-4">
                              <div className="bg-gray-200 rounded-lg p-3">
                                <div className="text-sm text-muted-foreground">Wickets</div>
                                <div className="text-2xl font-bold">{selectedPlayer.wickets}</div>
                              </div>
                              <div className="bg-gray-200 rounded-lg p-3">
                                <div className="text-sm text-muted-foreground">Economy Rate</div>
                                <div className="text-2xl font-bold">{selectedPlayer.economy_rate.toFixed(2)}</div>
                              </div>
                              <div className="bg-gray-200 rounded-lg p-3">
                                <div className="text-sm text-muted-foreground">Overs Bowled</div>
                                <div className="text-2xl font-bold">{selectedPlayer.overs_bowled}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">General Statistics</h3>
                          <div className="grid grid-cols-4 gap-4">
                            <div className="bg-gray-200 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">Total Runs</div>
                              <div className="text-2xl font-bold">{selectedPlayer.total_runs}</div>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">Balls Faced</div>
                              <div className="text-2xl font-bold">{selectedPlayer.balls_faced}</div>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">Innings Played</div>
                              <div className="text-2xl font-bold">{selectedPlayer.innings_played}</div>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">Wickets</div>
                              <div className="text-2xl font-bold">{selectedPlayer.wickets}</div>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">Overs Bowled</div>
                              <div className="text-2xl font-bold">{selectedPlayer.overs_bowled}</div>
                            </div>
                            <div className="bg-gray-200 rounded-lg p-3">
                              <div className="text-sm text-muted-foreground">Runs Conceded</div>
                              <div className="text-2xl font-bold">{selectedPlayer.runs_conceded}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end w-full gap-3 mt-8">
                      <button
                        onClick={closeModal}
                        type="button"
                        className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:w-auto"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
                {modalType === "edit" && (
                  <>
                    <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
                      Edit Player
                    </h4>
                    <form>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Player Name:
                          </label>
                          <input
                            name="name"
                            type="text"
                            defaultValue={selectedPlayer.name}
                            onChange={handleEditInputChange}
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            University:
                          </label>
                          <input
                            name="university"
                            type="text"
                            defaultValue={selectedPlayer.university}
                            onChange={handleEditInputChange}
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Category:
                          </label>
                          <select
                            name="category"
                            defaultValue={selectedPlayer.category}
                            onChange={handleEditSelectChange}
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          >
                            <option value="Batsman">Batsman</option>
                            <option value="Bowler">Bowler</option>
                            <option value="All-Rounder">All-Rounder</option>
                          </select>
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Total Runs:
                          </label>
                          <input
                            name="total_runs"
                            type="number"
                            defaultValue={selectedPlayer.total_runs}
                            onChange={handleEditInputChange}
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Balls Faced:
                          </label>
                          <input
                            name="balls_faced"
                            type="number"
                            defaultValue={selectedPlayer.balls_faced}
                            onChange={handleEditInputChange}
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Innings Played:
                          </label>
                          <input
                            name="innings_played"
                            type="number"
                            defaultValue={selectedPlayer.innings_played}
                            onChange={handleEditInputChange}
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Wickets:
                          </label>
                          <input
                            name="wickets"
                            type="number"
                            defaultValue={selectedPlayer.wickets}
                            onChange={handleEditInputChange}
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Overs Bowled:
                          </label>
                          <input
                            name="overs_bowled"
                            type="number"
                            defaultValue={selectedPlayer.overs_bowled}
                            onChange={handleEditInputChange}
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                        <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Runs Conceded:
                          </label>
                          <input
                            name="runs_conceded"
                            type="number"
                            defaultValue={selectedPlayer.runs_conceded}
                            onChange={handleEditInputChange}
                            className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end w-full gap-3 mt-8">
                        <button
                          onClick={closeModal}
                          type="button"
                          className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:w-auto"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 sm:w-auto"
                          onClick={handleEditSaveChanges}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </>
                )}
                {modalType === "delete" && (
                  <>
                    <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
                      Delete Player: {selectedPlayer.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Are you sure you want to delete this player?
                    </p>
                    <div className="flex items-center justify-end w-full gap-3 mt-8">
                      <button
                        onClick={closeModal}
                        type="button"
                        className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-red-500 shadow-theme-xs hover:bg-red-600 sm:w-auto"
                        onClick={handleDeleteSaveChanges}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={2000} theme="colored" />
    </>
  );
}
