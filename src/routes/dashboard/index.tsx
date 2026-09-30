import { createFileRoute } from "@tanstack/react-router";
import { countUsers, getRecentUsers } from "#/lib/server_functions/auth/user";
import { getProducts } from "#/lib/server_functions/product";

export const Route = createFileRoute("/dashboard/")({
	loader: async () => {
		const [totalUsers, recentUsers, { allProducts }] = await Promise.all([
			countUsers(),
			getRecentUsers(),
			getProducts(),
		]);

		return {
			totalUsers,
			totalProducts: allProducts.length,
			recentUsers,
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { totalUsers, totalProducts, recentUsers } = Route.useLoaderData();

	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<div className="p-6 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
							Total Users
						</p>
						<p className="text-3xl font-bold text-gray-900 mt-1">
							{totalUsers}
						</p>
					</div>
					<div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl">
						👥
					</div>
				</div>

				<div className="p-6 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
							Total Products
						</p>
						<p className="text-3xl font-bold text-gray-900 mt-1">
							{totalProducts}
						</p>
					</div>
					<div className="p-3 bg-green-50 text-green-600 rounded-lg text-xl">
						📄
					</div>
				</div>

				<div className="p-6 bg-white rounded-xl shadow-xs border border-gray-200 flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
							Your Role
						</p>
						<p className="text-3xl font-bold text-gray-900 mt-1 capitalize">
							admin
						</p>
					</div>
					<div className="p-3 bg-purple-50 text-purple-600 rounded-lg text-xl">
						🛡️
					</div>
				</div>
			</div>
			<div className="bg-white rounded-xl shadow-xs border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
					<h2 className="font-semibold text-gray-800">Recent Users</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
								<th className="px-6 py-3">Name</th>
								<th className="px-6 py-3">Email</th>
								<th className="px-6 py-3">Role</th>
								<th className="px-6 py-3">Joined</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 text-sm text-gray-600">
							{recentUsers.length === 0 ? (
								<tr>
									<td
										className="px-6 py-4 text-center text-gray-500"
										colSpan={4}
									>
										Nog geen gebruikers.
									</td>
								</tr>
							) : (
								recentUsers.map((user) => (
									<tr key={user.id} className="hover:bg-gray-50/70 transition">
										<td className="px-6 py-4 font-medium text-gray-900">
											{user.username}
										</td>
										<td className="px-6 py-4">{user.email}</td>
										<td className="px-6 py-4 capitalize">{user.role}</td>
										<td className="px-6 py-4 text-gray-500">
											{new Date(user.createdAt).toLocaleDateString("nl-NL", {
												day: "2-digit",
												month: "short",
												year: "numeric",
											})}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
