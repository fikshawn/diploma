import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HardDriveUpload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import type { Product } from "#/db";
import { deleteProduct, getProducts } from "#/lib/server_functions/product";

export const Route = createFileRoute("/dashboard/products/")({
	loader: async () => {
		const products = await getProducts();
		return products;
	},
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const products = Route.useLoaderData();
	const handleDelete = async (product: Product) => {
		try {
			const result = await deleteProduct({
				data: { id: product.id },
			});

			if (result.success) {
				toast.success(result.message);
				navigate({ to: "/dashboard/products" });
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			console.error("Failed to delete product", error);
		}
	};
	return (
		<div>
			<div className="flex justify-end mb-6">
				<Link
					to="/dashboard/products/create"
					className="text-left border border-slate-200 bg-blue-600 text-white flex items-center gap-3 text-sm hover:bg-blue-500 px-2 py-2 rounded-lg transition"
				>
					<HardDriveUpload /> Add new product
				</Link>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Name
							</th>

							<th
								scope="col"
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Created At
							</th>
							<th
								scope="col"
								className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{products.allProducts.map((product) => (
							<tr key={product.id}>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center">
										<div className="ml-4">
											<div className="text-sm font-medium text-gray-900">
												{product.title}
											</div>
										</div>
									</div>
								</td>

								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{product.createdAt.toDateString()}
								</td>

								<td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
									<Link
										params={{ productSlug: product.slug }}
										to="/dashboard/products/$productSlug/edit"
										className="text-indigo-600 hover:text-indigo-900"
									>
										Edit
									</Link>
									<Button
										onClick={() => handleDelete(product)}
										className="ml-2 text-red-600 hover:text-red-900"
									>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
