import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { HardDriveUpload } from "lucide-react";
import { toast } from "sonner";
import { TagsInput } from "#/components/TagsInput";
import { uploadImage } from "#/lib/imageUpload";
import { createProduct } from "#/lib/server_functions/product";

export const Route = createFileRoute("/dashboard/products/create")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			excerpt: "",
			metatitle: "",
			tags: [] as string[],
			image: undefined as File | undefined,
		},
		onSubmit: async ({ value }) => {
			console.log(value);
			if (value.image) {
				const formData = new FormData();
				formData.set("image", value.image);

				const result = await uploadImage({
					data: formData,
				});
				console.log(result.imageUrl);
				const response = await createProduct({
					data: {
						title: value.title,
						excerpt: value.excerpt,
						metatitle: value.metatitle,
						description: value.description,
						tags: value.tags,
						image: result.imageUrl,
					},
				});

				if (response.success) {
					toast.success("Product added successfully");
					await navigate({ to: "/dashboard/products" });
				}
			}
		},
	});
	return (
		<div className="flex justify-center items-center py-20">
			<div className="w-full max-w-2xl px-4 py-8">
				<div className="card rounded-3xl p-6 sm:p-8">
					<div className="text-center mb-7">
						<h1 className="text-2xl font-bold text-slate-800 mt-3">
							Add new product
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

						<form.Field
							name="image"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Image is required";
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
						<button
							type="submit"
							className="submit-btn w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded transition shadow-sm shadow-indigo-200/50 flex items-center justify-center gap-2"
						>
							<HardDriveUpload /> Add document
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
