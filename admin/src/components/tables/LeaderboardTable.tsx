import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Team } from "../../types/team.type";
import { useContext, useEffect, useState } from "react";
import { getLeaderboard } from "../../services/teams.service";
import { WebsocketContext } from "../../context/WebSocketContext";

export default function LeaderboardTable() {
  const [leaderboardData, setLeaderboardData] = useState<Team[]>([]);
  const [ready, val] = useContext(WebsocketContext); // use it just like a hook

  useEffect(() => {
      getLeaderboard()
        .then((data) => setLeaderboardData(data))
        .catch((error) => console.error(error));
    }
  , []);

  useEffect(() => {
    if (ready && val) {
      console.log("Data received from websocket:", val);
      getLeaderboard()
        .then((data) => setLeaderboardData(data))
        .catch((error) => console.error(error));
    }
  }, [ready, val]);

  return (
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
                  Position
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Team Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Owner Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Points
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {leaderboardData.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="font-bold">
                      {index === 0 ? (
                        <span className="text-yellow-500">🥇</span>
                      ) : index === 1 ? (
                        <span className="text-gray-400">🥈</span>
                      ) : index === 2 ? (
                        <span className="text-bronze-500">🥉</span>
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {entry.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {entry.user.username}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    {entry.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
