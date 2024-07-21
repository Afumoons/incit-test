import React, { useState } from "react";
import { changePassword } from "../services/authService";
import Cookies from "js-cookie";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface IFormInput {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one digit")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

const PasswordChangeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await changePassword(
        Cookies.get("email"),
        data.oldPassword,
        data.newPassword
      );
      alert("Password changed successfully");
    } catch (err) {
      console.error("Error changing password", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-4 bg-white p-4 rounded shadow"
    >
      <div>
        <label className="block text-sm font-bold mb-2">Old Password</label>
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            {...register("oldPassword")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-2">
            <button
              type="button"
              onClick={toggleOldPasswordVisibility}
              className="focus:outline-none"
            >
              {showOldPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {errors.oldPassword && (
          <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">New Password</label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            {...register("newPassword")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-2">
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="focus:outline-none"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {errors.newPassword && (
          <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-bold mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-2">
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="focus:outline-none"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
      >
        Change Password
      </button>
    </form>
  );
};

export default PasswordChangeForm;
