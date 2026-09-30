import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { signupFn } from "#/lib/server_functions/auth/authentication";

export const Route = createFileRoute("/panchak2")({
	head: () => ({
		meta: [
			{ title: "Registreren | Certificaat Kopen" },
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [type, setType] = useState("password");
	const handleType = () => {
		if (type === "password") {
			setType("text");
		} else {
			setType("password");
		}
	};
	const form = useForm({
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			console.log(value);
			const response = await signupFn({
				data: {
					username: value.username,
					email: value.email,
					password: value.password,
				},
			});
			if (response.success) {
				toast.success(response.message);
				navigate({ to: "/dashboard" });
			}
		},
	});
	return (
		<div className="flex justify-center items-center py-20">
			<div className="w-full max-w-md px-4 py-8">
				<div className="card rounded-3xl p-6 sm:p-8">
					<div className="text-center mb-7">
						<div className="flex justify-center">
							<img className="block h-20 w-auto" src="/logo.png" alt="Logo" />
						</div>
						<h1 className="text-2xl font-bold text-slate-800 mt-3">
							Create account
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
							name="username"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Name is required";
									if (value.length < 4)
										return "Name must be at least 4 characters";
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
										Full name
									</label>
									<div className="input-group flex items-center bg-white rounded border border-slate-200/80 px-4 py-2.5 transition">
										<User size={20} className="mr-2 text-slate-400" />
										<input
											type="text"
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Alex Rivera"
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
							name="email"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Email is required";
									if (!/^\S+@\S+\.\S+$/.test(value)) return "Email is invalid";
								},
							}}
						>
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Email address
									</label>
									<div className="input-group flex items-center bg-white rounded border border-slate-200/80 px-4 py-2.5 transition">
										<Mail size={20} className="mr-2 text-slate-400" />
										<input
											type="email"
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="you@example.com"
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
							name="password"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Password is required";
									if (value.length < 8)
										return "Password must be at least 8 characters";
								},
							}}
						>
							{(field) => (
								<div>
									<label
										htmlFor={field.name}
										className="block text-sm font-medium text-slate-700 mb-1.5"
									>
										Password
									</label>
									<div className="input-group flex items-center bg-white rounded border border-slate-200/80 px-4 py-2.5 transition">
										<Lock size={20} className="mr-2 text-slate-400" />
										<input
											type={type}
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="••••••••"
											className="w-full bg-transparent border-0 focus:ring-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
										/>

										<button
											onClick={handleType}
											type="button"
											className="text-slate-400 hover:text-slate-600 transition text-sm"
										>
											<i className="far fa-eye"></i>
										</button>
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
							className="submit-btn w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded transition shadow-sm shadow-indigo-200/50 flex items-center justify-center gap-2"
						>
							<i className="fas fa-user-plus"></i> Create account
						</button>
					</form>

					<p className="text-center text-sm text-slate-500 mt-6">
						Already have an account?{" "}
						<Link
							to="/panchak"
							className="text-indigo-600 hover:text-indigo-800 font-medium transition"
						>
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
