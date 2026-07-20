import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import Badge from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PaginationController from "@/components/ui/pagination";
import { Program } from "@/services/attendanceService";

interface ProgramListTableProps {
  programs: Program[];
  loading: boolean;
  selectedProgramId: string | null;
  onSelectProgram: (id: string) => void;
  page: number;
  limit: number;
  total: number;
  onPageChange: (newPage: number) => void;
  onUpdateClick: () => void;
  t: any;
}

export function ProgramListTable({
  programs,
  loading,
  selectedProgramId,
  onSelectProgram,
  page,
  limit,
  total,
  onPageChange,
  onUpdateClick,
  t,
}: ProgramListTableProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 overflow-auto rounded-md border border-[#333b45]">
        <Table>
          <TableHeader>
            <TableRow className="border-[#333b45] hover:bg-transparent">
              <TableHead className="w-[60px] text-center">{t.columnSelect || "Select"}</TableHead>
              <TableHead>{t.columnProgramTitle}</TableHead>
              <TableHead>{t.columnStartDate}</TableHead>
              <TableHead>{t.columnVenue}</TableHead>
              <TableHead>{t.columnStatus}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : programs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  No programs found.
                </TableCell>
              </TableRow>
            ) : (
              programs.map((prog) => (
                <TableRow
                  key={prog._id}
                  className={`border-[#333b45] hover:bg-[#2a3038] ${
                    selectedProgramId === prog._id
                      ? "bg-[#2a3038]"
                      : ""
                  }`}
                  onClick={() => onSelectProgram(prog._id)}
                >
                  <TableCell className="w-[50px] text-center">
                    <Checkbox
                      className="size-5 rounded-md border-2 border-gray-500 bg-gray-800 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      checked={selectedProgramId === prog._id}
                      onCheckedChange={() => onSelectProgram(prog._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-white">{prog.title}</TableCell>
                  <TableCell>
                    {prog.startDate
                      ? new Date(prog.startDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>{prog.venueName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-900/30 text-green-500 border-green-800 rounded-md px-3 py-1"
                    >
                      {prog.status || "Published"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-end mt-4">
        <div className="mb-6 mr-2">
          <PaginationController
            page={page}
            totalPages={Math.ceil(total / limit) || 1}
            onPageChange={onPageChange}
          />
        </div>

        <div className="flex justify-center w-full">
          <Button
            disabled={!selectedProgramId}
            onClick={onUpdateClick}
            className="bg-transparent text-white border border-gray-500 hover:bg-gray-800"
          >
            {t.updateButton}
          </Button>
        </div>
      </div>
    </div>
  );
}
