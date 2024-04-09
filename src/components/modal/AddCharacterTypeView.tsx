import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  BoxProps,
  TextField,
  Typography,
  TypographyProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useForm } from "react-hook-form";

import Store from "../../store";
import { CharacterTypeSchema, ICharacterType } from "../../types";
import { v4 } from "uuid";

import Button from "../Button";

const StyledAddCharacterTypeView = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    height: "100%",
    gap: theme.spacing(7.5),
    position: "relative",
    "& .btnSave": {
      position: "absolute",
      bottom: theme.spacing(4.5),
      left: 0,
      right: 0,
    },
  },
}));

const StyledLabel = styled(Typography)<TypographyProps>(() => ({
  color: "#93969e",
}));

const StyledFieldContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  width: "100%",
}));

const AddCharacterTypeView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Pick<ICharacterType, "name">>({
    resolver: zodResolver(CharacterTypeSchema.pick({ name: true })),
    reValidateMode: "onBlur",
    mode: "onBlur",
  });

  const handleAddCharacterType = async (
    characterType: Pick<ICharacterType, "name">,
  ) => {
    Store.notification.show("Adding character ...");
    const exists = Store.characterTypes.every(
      (_characterType) => characterType.name === _characterType.name,
    );
    if (!exists) {
      const createdCharacterType = CharacterTypeSchema.parse({
        id: v4(),
        name: characterType.name,
      });
      Store.createCharacterType(createdCharacterType);
      setTimeout(() => {
        Store.notification.show("Character Added successfully", "success");
        Store.modals.addCharacterType.setVisibility(false);
      }, 1500);
    } else {
      Store.notification.show("Something went wrong", "error");
    }
  };

  return (
    <StyledAddCharacterTypeView
      component={"form"}
      onSubmit={handleSubmit((submitCharacterType) =>
        handleAddCharacterType(submitCharacterType),
      )}
    >
      <StyledFieldContainer>
        <StyledLabel variant={"body2"}>Type name</StyledLabel>
        <TextField
          size={"small"}
          error={Boolean(errors.name?.message)}
          helperText={
            <Typography variant={"body2"} component={"span"}>
              {errors.name?.message}
            </Typography>
          }
          {...register("name", { required: true })}
        />
      </StyledFieldContainer>

      <Button
        className={"btnSave"}
        type={"submit"}
        variant="contained"
        bgColor={"#65cd95"}
        textColor={"#fffffff"}
        activeBgColor={"#3e815d"}
        fullWidth
        disabled={Object.keys(errors).length > 0}
      >
        Save Character type
      </Button>
    </StyledAddCharacterTypeView>
  );
};

export default AddCharacterTypeView;
