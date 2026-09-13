import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { HardDriveUpload } from "lucide-react";
import { toast } from "sonner";
import { TagsInput } from "#/components/TagsInput";
import { uploadImage } from "#/lib/imageUpload";
import {
	getProductBySlug,
	updateProductById,
} from "#/lib/server_functions/product";

export const Route = createFileRoute("/dashboard/products/$productSlug/edit")({
	loader: async ({ params }) => {
		const product = await getProductBySlug({
			data: { slug: params.productSlug },
		});

		return { product };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { product } = Route.useLoaderData();
	const form = useForm({
		defaultValues: {
			title: product?.title ?? "",
			excerpt: product?.excerpt ?? "",
			metatitle: product?.metatitle ?? "",
			description: product?.description ?? "",
			tags: product?.tags ?? [],
			image: undefined as File | undefined,
		},
		onSubmit: async ({ value }) => {
			if (!product) {
				throw new Error("Procudt not found");
			}
			let imageUrl = product.image ?? "";

			// Only upload new image if one was selected
			if (value.image) {
				const formData = new FormData();
				formData.set("image", value.image);

				const result = await uploadImage({
					data: formData,
				});
				imageUrl = result.imageUrl;
			}
			const response = await updateProductById({
				data: {
					id: product?.id,
					title: value.title,
					excerpt: value.excerpt,
					metatitle: value.metatitle,
					description: value.description,
					image: imageUrl,
					oldImage: product.image,
					tags: value.tags,
				},
			});
			if (response.success) {
				toast.success("Category created successfully");
				navigate({ to: "/dashboard/products" });
			} else {
				window.location.reload();
			}
		},
	});
	return (
		<div className="flex justify-center items-center py-20">
			<div className="w-full max-w-2xl px-4 py-8">
				<div className="card rounded-3xl p-6 sm:p-8">
					<div className="text-center mb-7">
						<h1 className="text-2xl font-bold text-slate-800 mt-3">
							Edit Product
						</h1>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-5"
					>
						<form.Field
							name="title"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Name is required";
									if (value.length < 10)
										return "Name must be at least 10 characters";
								},
								onChangeAsyncDebounceMs: 500,
							}}
						>
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Title
									</label>
									<div className="input-group flex items-center bg-white rounded border border-slate-200/80 px-4 py-2.5 transition">
										<input
											type="text"
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Title"
											className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
										/>
									</div>
									{field.state.meta.errors.length > 0 && (
										<span className="text-red-500 text-xs">
											{field.state.meta.errors.join(", ")}
										</span>
									)}
								</div>
							)}
						</form.Field>
						<form.Field
							name="metatitle"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Name is required";
									if (value.length < 10)
										return "Name must be at least 10 characters";
								},
								onChangeAsyncDebounceMs: 500,
							}}
						>
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Meta Title
									</label>
									<div className="input-group flex items-center bg-white rounded border border-slate-200/80 px-4 py-2.5 transition">
										<input
											type="text"
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder=" Meta Title"
											className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
										/>
									</div>
									{field.state.meta.errors.length > 0 && (
										<span className="text-red-500 text-xs">
											{field.state.meta.errors.join(", ")}
										</span>
									)}
								</div>
							)}
						</form.Field>
						<form.Field
							name="excerpt"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Name is required";
									if (value.length < 10)
										return "Name must be at least 10 characters";
								},
								onChangeAsyncDebounceMs: 500,
							}}
						>
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Excerpt
									</label>
									<div className="input-group flex items-center bg-white rounded border border-slate-200/80 px-4 py-2.5 transition">
										<textarea
											id={field.name}
											value={field.state.value}
											rows={10}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Enter description"
											className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
										/>
									</div>
									{field.state.meta.errors.length > 0 && (
										<span className="text-red-500 text-xs">
											{field.state.meta.errors.join(", ")}
										</span>
									)}
								</div>
							)}
						</form.Field>
						<form.Field
							name="description"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Name is required";
									if (value.length < 10)
										return "Name must be at least 10 characters";
								},
								onChangeAsyncDebounceMs: 500,
							}}
						>
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Description
									</label>
									<div className="input-group flex items-center bg-white rounded border border-slate-200/80 px-4 py-2.5 transition">
										<textarea
											id={field.name}
											value={field.state.value}
											rows={10}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Enter description"
											className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
										/>
									</div>
									{field.state.meta.errors.length > 0 && (
										<span className="text-red-500 text-xs">
											{field.state.meta.errors.join(", ")}
										</span>
									)}
								</div>
							)}
						</form.Field>

						<form.Field name="tags">
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Tags
									</label>
									<TagsInput
										value={field.state.value}
										onChange={(tags) => field.handleChange(tags)}
									/>
								</div>
							)}
						</form.Field>

						<form.Field name="image">
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Image
									</label>
									<div className="input-group flex items-center bg-white rounded border border-slate-200/80 px-4 py-2.5 transition">
										<input
											type="file"
											id={field.name}
											accept="image/jpeg,png,jpg"
											onChange={(e) => field.handleChange(e.target.files?.[0])}
											className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
										/>
									</div>
									{field.state.meta.errors.length > 0 && (
										<span className="text-red-500 text-xs">
											{field.state.meta.errors.join(", ")}
										</span>
									)}
								</div>
							)}
						</form.Field>
						<div className="mt-2">
							<div>
								<Image
									src={
										product?.image
											? `/uploadedImages/products/${product.image}`
											: ""
									}
									alt={product?.title}
									width={100}
									height={50}
								/>
							</div>
						</div>
						<button
							type="submit"
							className="submit-btn w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded transition shadow-sm shadow-indigo-200/50 flex items-center justify-center gap-2"
						>
							<HardDriveUpload /> Update product
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
