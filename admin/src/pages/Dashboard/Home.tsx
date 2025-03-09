import { useEffect, useState } from "react";
import { getTournamentSummary } from "../../services/tournament.service";
import PageMeta from "../../components/common/PageMeta";
import { TournamentSummary } from "../../types/tournament.type";

export default function Home() {
  const [tournamentSummary, setTournamentSummary] = useState<TournamentSummary | null>(null);

  useEffect(() => {
    const fetchTournamentSummary = async () => {
      try {
        const summary = await getTournamentSummary();
        setTournamentSummary(summary);
      } catch (error) {
        console.error("Error fetching tournament summary:", error);
      }
    };

    fetchTournamentSummary();
  }, []);

  return (
    <>
      <PageMeta
        title="Tournament Dashboard | Spirit11 Admin"
        description="Tournament Dashboard showing overall statistics and top performers"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tournament Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">View overall tournament statistics and top performers</p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-black dark:text-white">
                  {tournamentSummary?.overall_runs || '-'}
                </h4>
                <span className="text-sm font-medium">Total Runs</span>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2">
                <svg className="fill-primary dark:fill-white" width="22" height="16" viewBox="0 0 22 16">
                  <path d="M11 15.1156C4.19376 15.1156 0.825012 8.61876 0.687512 8.34376C0.584387 8.13751 0.584387 7.86251 0.687512 7.65626C0.825012 7.38126 4.19376 0.918762 11 0.918762C17.8063 0.918762 21.175 7.38126 21.3125 7.65626C21.4156 7.86251 21.4156 8.13751 21.3125 8.34376C21.175 8.61876 17.8063 15.1156 11 15.1156ZM2.26876 8.00001C3.02501 9.27189 5.98126 13.5688 11 13.5688C16.0188 13.5688 18.975 9.27189 19.7313 8.00001C18.975 6.72814 16.0188 2.43126 11 2.43126C5.98126 2.43126 3.02501 6.72814 2.26876 8.00001Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold text-black dark:text-white">
                  {tournamentSummary?.overall_wickets || '-'}
                </h4>
                <span className="text-sm font-medium">Total Wickets</span>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2">
                <svg className="fill-primary dark:fill-white" width="20" height="22" viewBox="0 0 20 22">
                  <path d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6">
          <div className="rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="mb-4 justify-between gap-4 sm:flex">
              <h4 className="text-xl font-semibold text-black dark:text-white">Top Performers</h4>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <h5 className="mb-3 text-sm font-medium uppercase">Top Run Scorers</h5>
                {tournamentSummary?.highest_run_scorers.map((scorer, index) => (
                  <div key={scorer.id} className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h6 className="text-sm font-medium text-black dark:text-white">{scorer.name}</h6>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-black dark:text-white">{scorer.runs}</span>
                  </div>
                ))}
              </div>

              <div>
                <h5 className="mb-3 text-sm font-medium uppercase">Top Wicket Takers</h5>
                {tournamentSummary?.highest_wicket_takers.map((taker, index) => (
                  <div key={taker.id} className="mb-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {index + 1}
                      </div>
                      <div className="ml-4">
                        <h6 className="text-sm font-medium text-black dark:text-white">{taker.name}</h6>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-black dark:text-white">{taker.wickets}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
