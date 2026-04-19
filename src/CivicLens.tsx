import { SearchIcon } from "lucide-react";
import { Field, FieldDescription, FieldLabel } from "./components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "./components/ui/input-group";
import { Input } from "./components/ui/input";

export default function CivicLens() {
  return (
    <div>
      <h2>Civic Lens</h2>
      <p>
        {" "}
        Civic Lens is a tool designed to analyze and visualize the impact of
        civic policies and initiatives on communities. It provides insights into
        how different policies affect various demographics, economic factors,
        and social outcomes. By leveraging data analytics and visualization
        techniques, Civic Lens helps policymakers, researchers, and the public
        understand the implications of civic decisions and promotes informed
        decision-making for better community outcomes.
      </p>
      <Field className="max-w-sm">
        <FieldLabel htmlFor="inline-start-input">Input</FieldLabel>
        <InputGroup>
          <InputGroupInput id="inline-start-input" placeholder="Search..." />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Search for civic policies</FieldDescription>
      </Field>
    </div>
  );
}
