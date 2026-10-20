import { useEffect, useState } from "react";
// import type { FormEvent, ChangeEvent } from "react";
import type { SyntheticEvent, ChangeEvent } from "react";
import type { Cafe } from "./types/cafe";
import type { Country } from "./types/country";
import ToggleSwitch from "./components/ToggleSwitch";
import "./index.css";

// declaring form fields
type CafeFormData = {
  name: string;
  country: string;
  address: string;
  phoneNumber: string;
  priceRange: string;
  rating: string;
};

// declare validation error
type FormErrors = Partial<Record<keyof CafeFormData, string>>;

// api to fetch and add cafes from and to cafe.json
const API_URL = "http://localhost:3001/api/cafes";

// default values for forms
const initialFormData: CafeFormData = {
  name: "",
  country: "Singapore",
  address: "",
  phoneNumber: "",
  priceRange: "",
  rating: "",
};


function App() {
  // -------------  declare react state variables  ------------- 
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  //form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] =
    useState<CafeFormData>(initialFormData);
  // validations
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [saving, setSaving] = useState(false);
  // countries
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  // table theme
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("cafeTableTheme") === "dark";
  });
  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  //search
  const [searchTerm, setSearchTerm] = useState("");

  //filter
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [minRating, setMinRating] = useState("");

  //sort
  const [sortColumn, setSortColumn] = useState<keyof Cafe>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // -------------------------  APIs ------------------------- 
  // load cafes from cafes.json
  useEffect(() => {
    const loadCafes = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load cafes.");
        }

        const data: Cafe[] = await response.json();
        setCafes(data);
      } catch {
        setApiError(
          "No cafes available!"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCafes();

  }, []);

  // load countries from countries.dev API
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch(
          "https://countries.dev/countries?fields=name,alpha2Code,callingCodes&sort=name"
        );

        if (!response.ok) {
          throw new Error("Failed to load countries.");
        }

        const data: Country[] = await response.json();

        setCountries(data.sort((a, b) =>
          a.name.localeCompare(b.name)
        ));
      } catch (error) {
        console.error("Failed to load countries:", error);
      } finally {
        setCountriesLoading(false);
      }
    };

    loadCountries();
  }, []);
  // ---------------------------------------------------------- 

  // update form when changed
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setApiError("");
  };

  // validation of form (requirement 3)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Cafe name is required.";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Please select a country.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (
      formData.phoneNumber.trim() &&
      !/^\+?[\d\s()-]+$/.test(formData.phoneNumber.trim())
    ) {
      newErrors.phoneNumber = "Enter a valid phone number.";
    }

    if (!formData.priceRange) {
      newErrors.priceRange = "Please select a price range.";
    }

    if (formData.rating.trim() !== "") {
      const rating = Number(formData.rating);

      if (
        !Number.isFinite(rating) ||
        rating < 1 ||
        rating > 5
      ) {
        newErrors.rating = "Rating must be between 1 and 5.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // add into cafes.json
  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setApiError("");

    // validating
    if (!validateForm()) {
      return;
    }
    setSaving(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          country: formData.country,
          address: formData.address.trim(),
          phoneNumber: formData.phoneNumber.trim() || null,
          priceRange: formData.priceRange,
          rating:
            formData.rating.trim() === ""
              ? null
              : Number(formData.rating),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add cafe.");
      }

      // add the cafe returned to table (requirement 4)
      setCafes((previous) => [...previous, result]);

      setFormData({ ...initialFormData });
      setErrors({});
      setShowForm(false);
    }
    catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Something went wrong while adding the cafe."
      );
    }
    finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ ...initialFormData });
    setErrors({});
    setApiError("");
  };

  // toggle table theme and save
  const handleThemeChange = (checked: boolean) => {
    setDarkMode(checked);

    localStorage.setItem(
      "cafeTableTheme",
      checked ? "dark" : "light"
    );
  };

  // search
  const filteredCafes = cafes.filter((cafe) => {
    const matchesSearch =
      `${cafe.name} ${cafe.country} ${cafe.address}`
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

    const matchesCountry =
      selectedCountry === "" || cafe.country === selectedCountry;

    const matchesPrice =
      selectedPriceRange === "" ||
      cafe.priceRange === selectedPriceRange;

    const matchesRating =
      minRating === "" ||
      (cafe.rating !== null && cafe.rating >= Number(minRating));

    return (
      matchesSearch &&
      matchesCountry &&
      matchesPrice &&
      matchesRating
    );
  });

  //countries
  const countriesList = [...new Set(cafes.map((cafe) => cafe.country))]
    .sort();

  //price range
  const priceRangesList = [
    ...new Set(cafes.map((cafe) => cafe.priceRange)),
  ].sort();

  const sortedCafes = [...filteredCafes].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];

    // missing values bottom
    if (valueA === null) return 1;
    if (valueB === null) return -1;

    let comparison = 0;

    if (typeof valueA === "number" && typeof valueB === "number") {
      comparison = valueA - valueB;
    } else {
      comparison = String(valueA).localeCompare(String(valueB));
    }

    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedCafes.length / rowsPerPage);
  const currentCafes = sortedCafes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (column: keyof Cafe) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  // change page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="app">
      {/* ------------------------------- header  ------------------------------- */}
      <header className="app-header">
        <div>
          <h1>CafeBook</h1>
          <p>Your personal cafe hopping guide.</p>
        </div>
      </header>

      {apiError && (
        <p className="error-message" role="alert">
          {apiError}
        </p>
      )}

      {/* ------------------------------- form container  ------------------------------- */}
      <div className="add-cafe-container">
        {/* toggle light/ dark mode - cached (requirement 5) */}
        <div className="theme-toggle">
          <ToggleSwitch
            checked={darkMode}
            onChange={handleThemeChange} />
        </div>

        {/* add item" button to open the form (requirement 2) */}
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setErrors({});
            setApiError("");
          }}
        >
          + Add Item
        </button>
      </div>

      {showForm && (
        <section className="form-section">
          <h2>Add a Cafe</h2>

          {/* close form button */}
          <button
            type="button"
            className="close-form-button"
            onClick={() => {
              setShowForm(false);
              setErrors({});
              setApiError("");
            }}
            aria-label="Close form">x</button>

          {/* ------------------------------- form  -------------------------------  */}
          <form onSubmit={handleSubmit} noValidate>
            <p className="form-message">
              Fields marked with * are required.
            </p>
            {/* name */}
            <div className="form-group">
              {/* added astrix * for required fields */}
              <label htmlFor="name">Cafe Name *</label>
              <input
                id="id"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter cafe name"
                required
              />
              {errors.name && (
                <p className="field-error">{errors.name}</p>
              )}
            </div>
            {/* country */}
            <div className="form-group">
              <label htmlFor="country">Country *</label>

              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">
                  {countriesLoading ? "Loading countries..." : "Select a country"}
                </option>

                {countries.map((country) => (
                  <option key={country.alpha2Code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>

              {errors.country && (
                <p className="field-error">{errors.country}</p>
              )}
            </div>
            {/* address */}
            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
              />
              {errors.address && (
                <p className="field-error">{errors.address}</p>
              )}
            </div>
            {/* phone number */}
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. 12345678"
              />
              {errors.phoneNumber && (
                <p className="field-error">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            {/* price range */}
            <div className="form-group">
              <label htmlFor="priceRange">Price Range *</label>
              <select
                id="priceRange"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                required
              >
                <option value="">Select price range</option>
                <option value="<$1">Less than $1</option>
                <option value="$1-$10">$1-$10</option>
                <option value="$10-$30">$10-$30</option>
                <option value="$20-$30">$20-$30</option>
                <option value="$30-$50">$30-$50</option>
                <option value="$40-$100">$40-$100</option>
                <option value=">$100">More than $100</option>
              </select>
              {errors.priceRange && (
                <p className="field-error">
                  {errors.priceRange}
                </p>
              )}
            </div>
            {/* rating */}
            <div className="form-group">
              <label htmlFor="rating">Rating (1-5)</label>
              <input
                id="rating"
                name="rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                placeholder="e.g. 4.5"
              />
              {errors.rating && (
                <p className="field-error">{errors.rating}</p>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Cafe"}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
      {/* cafes.json data in a table (requirememt 1) */}
      <section className="cafe-section">
        {/* Main cafe table */}
        <div className="cafe-content">
          <p className="cafe-count">
            {filteredCafes.length}{" "}
            {filteredCafes.length === 1 ? "cafe" : "cafes"} found
          </p>
          {/* search */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by cafe name, country or address..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="cafe-layout">
            <aside className="filter-sidebar">
              <h3>Filters</h3>
              {/* country */}
              <label htmlFor="country-filter">Country</label>
              <select
                id="country-filter"
                value={selectedCountry}
                onChange={(event) => {
                  setSelectedCountry(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All countries</option>
                {countriesList.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {/* price */}
              <label htmlFor="price-filter">Price Range</label>
              <select
                id="price-filter"
                value={selectedPriceRange}
                onChange={(event) => {
                  setSelectedPriceRange(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All price ranges</option>
                {priceRangesList.map((price) => (
                  <option key={price} value={price}>
                    {price}
                  </option>
                ))}
              </select>
              {/* rating */}
              <label htmlFor="rating-filter">Minimum Rating</label>
              <select
                id="rating-filter"
                value={minRating}
                onChange={(event) => {
                  setMinRating(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Any rating</option>
                <option value="4">4.0 and above</option>
                <option value="3">3.0 and above</option>
                <option value="2">2.0 and above</option>
                <option value="1">1.0 and above</option>
              </select>
              {/* reset filters */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCountry("");
                  setSelectedPriceRange("");
                  setMinRating("");
                  setSearchTerm("");
                  setCurrentPage(1);
                }}>
                Clear Filters
              </button>
            </aside>
            {/* loading cafes on search bar */}
            {loading ? (
              <p>Loading cafes...</p>
            ) : cafes.length === 0 ? (
              <p>No cafes yet. Add your first cafe!</p>
            ) : filteredCafes.length === 0 ? (
              // when no cafes match
              <p>No matching cafes found.</p>
            ) : (
              // table to display data
              <div className={`table-container ${darkMode ? "dark-mode" : ""}`}>
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("id")}>
                        ID {sortColumn === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>

                      <th onClick={() => handleSort("name")}>
                        Cafe Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>

                      <th onClick={() => handleSort("country")}>
                        Country {sortColumn === "country" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>

                      <th onClick={() => handleSort("address")}>
                        Address {sortColumn === "address" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>

                      <th onClick={() => handleSort("phoneNumber")}>
                        Phone Number {sortColumn === "phoneNumber" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>

                      <th onClick={() => handleSort("priceRange")}>
                        Price Range {sortColumn === "priceRange" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>

                      <th onClick={() => handleSort("rating")}>
                        Rating {sortColumn === "rating" && (sortDirection === "asc" ? "↑" : "↓")}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentCafes.map((cafe) => (
                      <tr key={cafe.id}>
                        <td>{cafe.id}</td>
                        <td>{cafe.name}</td>
                        <td>{cafe.country}</td>
                        {/* <td>{cafe.address}</td> */}
                        <td>
                          {/* click -> google link maps */}
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${cafe.address}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >{cafe.address}</a>
                        </td>
                        <td>{cafe.phoneNumber ?? "—"}</td>
                        <td>{cafe.priceRange}</td>
                        <td>
                          {cafe.rating !== null
                            ? cafe.rating.toFixed(1)
                            : "Not rated"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    className={currentPage === page ? "active" : ""}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

        </div>
      </section>
    </main>
  );
}
export default App;