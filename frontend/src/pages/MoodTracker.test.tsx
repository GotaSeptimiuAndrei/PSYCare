import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MoodTracker from "./MoodTracker";

// 🔹 Mock NavigationBar (UI irrelevant for this test)
vi.mock("../components/NavigationBar", () => ({
  default: () => <div data-testid="navbar" />,
}));

// 🔹 Mock useLogMood hook
const mutateMock = vi.fn();

const mockState = {
  isPending: false,
  isSuccess: false,
  isError: false,
};

vi.mock("../hooks/useMood", () => ({
  useLogMood: () => ({
    mutate: mutateMock,
    ...mockState,
  }),
}));

describe("MoodTracker UI tests", () => {
  beforeEach(() => {
    mutateMock.mockClear();
    mockState.isPending = false;
    mockState.isSuccess = false;
    mockState.isError = false;
  });

  it("renders mood slider with range 1-10", () => {
    render(<MoodTracker />);

    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuemin", "1");
    expect(slider).toHaveAttribute("aria-valuemax", "10");
  });

  it("shows correct label and color for RED (1-3)", async () => {
    render(<MoodTracker />);

    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: 2 } });

    expect(
      screen.getByText(/Critical, really bad/i)
    ).toBeInTheDocument();
  });

  it("shows correct label for YELLOW (4-7)", async () => {
    render(<MoodTracker />);

    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: 5 } });

    expect(
      screen.getByText(/Okay, sad, could be better/i)
    ).toBeInTheDocument();
  });

  it("shows correct label for GREEN (8-10)", async () => {
    render(<MoodTracker />);

    const slider = screen.getByRole("slider");

    fireEvent.change(slider, { target: { value: 9 } });

    expect(
      screen.getByText(/Good, the happiest I've been/i)
    ).toBeInTheDocument();
  });

  it("allows entering a note", async () => {
    render(<MoodTracker />);

    const input = screen.getByLabelText(/How do you feel today/i);
    await userEvent.type(input, "Feeling much better today");

    expect(input).toHaveValue("Feeling much better today");
  });

  it("calls mutate with mood and note on save", async () => {
    render(<MoodTracker />);

    const slider = screen.getByRole("slider");
    const input = screen.getByLabelText(/How do you feel today/i);
    const button = screen.getByRole("button", { name: /save/i });

    fireEvent.change(slider, { target: { value: 8 } });
    await userEvent.type(input, "Had a great day");

    await userEvent.click(button);

    expect(mutateMock).toHaveBeenCalledWith({
      moodValue: 8,
      description: "Had a great day",
    });
  });

  it("shows success message when mutation succeeds", () => {
    mockState.isSuccess = true;

    render(<MoodTracker />);

    expect(
      screen.getByText(/Mood logged successfully/i)
    ).toBeInTheDocument();
  });

  it("shows error message when mutation fails", () => {
    mockState.isError = true;

    render(<MoodTracker />);

    expect(
      screen.getByText(/Failed to log mood/i)
    ).toBeInTheDocument();
  });

  it("disables save button while pending", () => {
    mockState.isPending = true;

    render(<MoodTracker />);

    const button = screen.getByRole("button", { name: /save/i });
    expect(button).toBeDisabled();
  });
});
