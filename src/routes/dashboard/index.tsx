import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="p-6 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
							Total Users
						</p>
						<p className="text-3xl font-bold text-gray-900 mt-1">1,245</p>
					</div>
					<div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl">
						👥
					</div>
				</div>

				<div className="p-6 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
							Active Sessions
						</p>
						<p className="text-3xl font-bold text-gray-900 mt-1">342</p>
					</div>
					<div className="p-3 bg-green-50 text-green-600 rounded-lg text-xl">
						⏱️
					</div>
				</div>

				<div className="p-6 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
							Monthly Revenue
						</p>
						<p className="text-3xl font-bold text-gray-900 mt-1">$12,840</p>
					</div>
					<div className="p-3 bg-purple-50 text-purple-600 rounded-lg text-xl">
						💰
					</div>
				</div>
			</div>
			<div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
					<h2 className="font-semibold text-gray-800">Recent Users</h2>
					<button
						type="button"
						className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
					>
						View All
					</button>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
								<th className="px-6 py-3">Name</th>
								<th className="px-6 py-3">Role</th>
								<th className="px-6 py-3">Status</th>
								<th className="px-6 py-3">Joined</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 text-sm text-gray-600">
							<tr className="hover:bg-gray-50/70 transition">
								<td className="px-6 py-4 font-medium text-gray-900">
									Jane Cooper
								</td>
								<td className="px-6 py-4">Admin</td>
								<td className="px-6 py-4">
									<span className="inline-flex px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
										Active
									</span>
								</td>
								<td className="px-6 py-4 text-gray-500">Jan 12, 2026</td>
							</tr>
							<tr className="hover:bg-gray-50/70 transition">
								<td className="px-6 py-4 font-medium text-gray-900">
									Alex Monroe
								</td>
								<td className="px-6 py-4">Editor</td>
								<td className="px-6 py-4">
									<span className="inline-flex px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
										Inactive
									</span>
								</td>
								<td className="px-6 py-4 text-gray-500">Mar 04, 2026</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
