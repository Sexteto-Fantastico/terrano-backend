import express from "express";

jest
    .spyOn(express.application, "listen")
    .mockImplementation((): any => {
        return {};
    });