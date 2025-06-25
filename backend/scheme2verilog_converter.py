import json
import sys

GATE_TYPE, GATE_INPUTS, GATE_OUTPUTS = 0, 1, 2
IO_GATE_NO, IO_GATE_WIRENO = 0, 1
MAX_GATE_TYPE = 8
# 0 = INPUT, 1 = OUTPUT, 2 = NOT, 3 = AND, 4 = OR, 5 = XOR, 6 = NAND, 7 = NOR, 8 = XNOR
GT_INPUT = 0
GT_OUTPUT = 1
GT_NOT = 2
GT_AND = 3
GT_OR = 4
GT_XOR = 5
GT_NAND = 6
GT_NOR = 7
GT_XNOR = 8

if len(sys.argv) != 2:
    print(f"usage: {sys.argv[0]} <file.json>")
    exit()
# Opening input files
# Input JSON object structure: [gate0, gate1, ...]
# gate:             [type, inputs, outputs]
# 0 <= type <= MAX_GATE_TYPE: int
# inputs, outputs:  [gateno0, gateno1, ...]
# 0 <= gateid < len(gate): int
jsonfile = None
try:
    jsonfile = open(sys.argv[1], 'r')
except OSError:
    print(f"Error: failed to open file \"{sys.argv[1]}\"")
    exit()
gates = None
try:
    gates = json.load(jsonfile)
except json.decoder.JSONDecodeError:
    print('Error: failed to decode the file')
    exit()
jsonfile.close()
# Verification
module_inputs = []
module_outputs = []
if type(gates) != list:
    print('Error: top-file object is not an array')
    exit()
for i in range(len(gates)):
    gate = gates[i]
    if type(gate) != list:
        print(f'Error: incorrect gate no.{i}: {gate}')
        exit()
    if type(gate[GATE_TYPE]) != int or gate[GATE_TYPE] < 0 or gate[GATE_TYPE] > MAX_GATE_TYPE:
        print(f'Error: incorrect gate type in gate no. {i}: {gate[GATE_TYPE]}')
        exit()
    if gate[GATE_TYPE] == GT_INPUT:
        module_inputs.append(i)
    elif gate[GATE_TYPE] == GT_OUTPUT:
        module_outputs.append(i)
    inputs = gate[GATE_INPUTS]
    outputs = gate[GATE_OUTPUTS]
    if type(inputs) != list:
        print(f'Error: incorrect inputs in gate no. {i}: {inputs}')
        exit()
    if type(outputs) != list:
        print(f'Error: incorrect outputs in gate no. {i}: {outputs}')
        exit()
    for j in range(len(inputs)):
        if type(inputs[j]) != int or inputs[j] < 0 or inputs[j] >= len(gates):
            print(f'Error: incorrect gate id in inputs of gate no. {i}: inputs[{j}] = {inputs[j]}')
            exit()
        inputs[j] = [inputs[j], -1]
    for j in range(len(outputs)):
        if type(outputs[j]) != int or outputs[j] < 0 or outputs[j] >= len(gates):
            print(f'Error: incorrect gate id in outputs of gate no. {i}: outputs[{j}] = {outputs[j]}')
            exit()
        outputs[j] = [outputs[j], -1]
# it's time to make wires
wire_cnt = 0
for i in range(len(gates)):
    inputs = gates[i][GATE_INPUTS]
    outputs = gates[i][GATE_OUTPUTS]
    for j in range(len(inputs)):
        if inputs[j][IO_GATE_WIRENO] == -1: # wire not created
            inputs[j][IO_GATE_WIRENO] = wire_cnt
            in_gate = inputs[j][IO_GATE_NO]
            for out_gate in gates[in_gate][GATE_OUTPUTS]:
                if out_gate[IO_GATE_NO] == i:
                    out_gate[IO_GATE_WIRENO] == wire_cnt
                    break
            else:
                print(f"Error: in the gate no. {i} there's an input gate no. {j}, but the gate no. {j} hasn't the gate no. {i} in its outputs")
                exit()
            wire_cnt += 1
    for j in range(len(outputs)):
        if outputs[j][IO_GATE_WIRENO] == -1: # wire not created
            outputs[j][IO_GATE_WIRENO] = wire_cnt
            out_gate = outputs[j][IO_GATE_NO]
            for in_gate in gates[out_gate][GATE_INPUTS]:
                if in_gate[IO_GATE_NO] == i:
                    in_gate[IO_GATE_WIRENO] = wire_cnt
                    break
            else:
                print(f"Error: in the gate no. {i} there's an output gate no. {j}, but the gate no. {j} hasn't the gate no. {i} in its inputs")
                exit()
            wire_cnt += 1
# Now it's time to start writing Verilog code
out_file = None
try:
    out_file = open('out.v', 'w')
except OSError:
    print("Failed to write to file \"out.v\"")
    exit()
module_inputs_str = []
module_outputs_str = []
for i in range(len(module_inputs)):
    module_inputs_str.append('i' + str(module_inputs[i]))
for i in range(len(module_outputs)):
    module_outputs_str.append('o' + str(module_outputs[i]))
s_inputs = ', '.join(module_inputs_str)
s_outputs = ', '.join(module_outputs_str)
param_str = f"{s_inputs}{', ' if len(module_inputs_str) != 0 and len(module_outputs_str) != 0 else ''}{s_outputs}"
out_file.write(f'module main({param_str});\n');
out_file.write(f'input {s_inputs};\n');
out_file.write(f'output {s_outputs};\n')
wires_str = ', '.join(map(lambda x: 'w' + str(x), range(wire_cnt)))
out_file.write(f'wire {wires_str};\n')
for i in range(len(gates)):
    gate = gates[i]
    gtp = gate[GATE_TYPE]
    if gtp == GT_INPUT:
        gate_out = gate[GATE_OUTPUTS][0][IO_GATE_WIRENO]
        out_file.write(f'assign w{gate_out} = i{i}')
    elif gtp == GT_OUTPUT:
        gate_in = gate[GATE_INPUTS][0][IO_GATE_WIRENO]
        out_file.write(f'assign o{i} = w{gate_in}')
    elif gtp == GT_NOT:
        gate_input = gate[GATE_INPUTS][0][IO_GATE_WIRENO]
        gate_output = gte[GATE_OUTPUTS][0][IO_GATE_WIRENO]
        out_file.write(f'assign w{gate_output} = ~w{gate_input}')
    else:
        gate_input1, gate_input2 = gate[GATE_INPUTS][0][IO_GATE_WIRENO], gate[GATE_INPUTS][1][IO_GATE_WIRENO]
        gate_output = gate[GATE_OUTPUTS][0][IO_GATE_WIRENO]
        out_file.write(f'assign w{gate_output} = ')
        if gtp == GT_AND:
            out_file.write(f'w{gate_input1} & w{gate_input2}')
        elif gtp == GT_OR:
            out_file.write(f'w{gate_input1} | w{gate_input2}')
        elif gtp == GT_XOR:
            out_file.write(f'w{gate_input1} ^ w{gate_input2}')
        elif gtp == GT_NAND:
            out_file.write(f'~(w{gate_input1} & w{gate_input2})')
        elif gtp == GT_NOR:
            out_file.write(f'~(w{gate_input1} | w{gate_input2})')
        elif gtp == GT_XNOR:
            out_file.write(f'~(w{gate_input1} ^ w{gate_input2})')
        else:
            print(f'Incorrect gate type at gate no. {i}: type = {gtp}')
            exit()
    out_file.write(';\n')
out_file.write('endmodule\n')
out_file.close()