import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { Player } from "../../types/player.type";
import { playerSchema } from "../../schemas/player.schema";

import { ToastContainer, toast } from "react-toastify";
import { createPlayer } from "../../services/player.service";

import { useNavigate } from "react-router";

export default function AddPlayer() {
  const [player, setPlayer] = useState<Player>({
    id: 0,
    name: "",
    university: "",
    category: "",
    total_runs: 0,
    balls_faced: 0,
    innings_played: 0,
    wickets: 0,
    overs_bowled: 0,
    runs_conceded: 0,
    points: 0,
    value: 0,
    batting_strike_rate: 0,
    batting_average: 0,
    bowling_strike_rate: 0,
    economy_rate: 0,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPlayer((prev) => ({
      ...prev,
      [name]: e.target.type == "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = playerSchema.safeParse(player);
    if (!result.success) {
      result.error.errors.forEach((err) => {
        toast.error(err.message);
        console.log(err)
      });
      setLoading(false);
      return;
    }
    createPlayer(player)
      .then(() => {
        toast.success("Player added successfully");
        setTimeout(() => {
          navigate("/players");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Add Player" />
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-theme-1">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Player Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={player.name}
                  onChange={handleInputChange}
                  placeholder="Enter player name"
                  className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  University
                </label>
                <input
                  name="university"
                  type="text"
                  value={player.university}
                  onChange={handleInputChange}
                  placeholder="Enter university"
                  className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Category
                </label>
                <select
                  name="category"
                  value={player.category}
                  onChange={handleInputChange}
                  className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">Select category</option>
                  <option value="Batsman">Batsman</option>
                  <option value="Bowler">Bowler</option>
                  <option value="All-Rounder">All-Rounder</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Runs
                </label>
                <input
                  name="total_runs"
                  type="number"
                  value={player.total_runs}
                  onChange={handleInputChange}
                  placeholder="Enter total runs"
                  className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Balls Faced
                </label>
                <input
                  name="balls_faced"
                  type="number"
                  value={player.balls_faced}
                  onChange={handleInputChange}
                  placeholder="Enter balls faced"
                  className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Innings Played
                </label>
                <input
                  name="innings_played"
                  type="number"
                  value={player.innings_played}
                  onChange={handleInputChange}
                  placeholder="Enter innings played"
                  className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Wickets
                </label>
                <input
                  name="wickets"
                  type="number"
                  value={player.wickets}
                  onChange={handleInputChange}
                  placeholder="Enter wickets"
                  className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Overs Bowled
                </label>
                <input
                  name="overs_bowled"
                  type="number"
                  value={player.overs_bowled}
                  onChange={handleInputChange}
                  placeholder="Enter overs bowled"
                  className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Runs Conceded
                </label>
                <input
                  name="runs_conceded"
                  type="number"
                  value={player.runs_conceded}
                  onChange={handleInputChange}
                  placeholder="Enter runs conceded"
                  className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end w-full gap-4 mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`flex justify-center px-10 py-3 text-sm font-medium text-white transition-colors rounded-lg ${
                  loading 
                  ? "bg-brand-400 cursor-not-allowed"
                  : "bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                }`}
              >
                {loading ? "Adding..." : "Add Player"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        theme="colored"
      />
    </div>
  );
}
