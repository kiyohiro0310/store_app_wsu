"use client";
import { ProductForm } from "@/types";
import "./uploader.css";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";


const Uploader = ({
  formData,
  setFormData,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  formData: ProductForm;
  setFormData: React.Dispatch<React.SetStateAction<ProductForm>>;
}) => {
  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      signatureEndpoint="/api/sign-cloudinary-params"
      onSuccess={(result) => {
        
        if (typeof result.info === "object" && "secure_url" in result.info) {
          setFormData((prevData) => ({
            ...prevData,
            imageUrl: (result.info as any).secure_url,
          }));
        }
      }}
      options={{
        singleUploadAutoClose: true,
        clientAllowedFormats: ["jpg", "png", "jpeg"],
        maxFiles: 1,
        multiple:false,
        resourceType: "image",
      }}
    >
      {({ open }) => {
        return (
          <button
            type="button"
            onClick={() => open()}
            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Upload Image
          </button>
        );
      }}
    </CldUploadWidget>
  );
};

export default Uploader;
