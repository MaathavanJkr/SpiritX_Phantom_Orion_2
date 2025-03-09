import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import LeaderboardTable from "../../components/tables/LeaderboardTable";

export default function Leaderboard() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Leaderboard" />
      <div className="space-y-6">
          <LeaderboardTable />
      </div>
    </>
  );
}
